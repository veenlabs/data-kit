import { createStore, combineReducers, applyMiddleware } from 'redux'
import { useDispatch } from 'react-redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleWare from 'redux-saga'
import { put, takeLatest, select, call, all } from 'redux-saga/effects'
import { default as isFunction } from 'lodash/isFunction'
import { default as omit } from 'lodash/omit'
import { default as get } from 'lodash/get'
import { default as set } from 'lodash/set'

//------------ Config ---------------

const ACTION_SEPARATION_CHARS = ':@'
const CONFIG_PROPS_OF_SLICE = ['name', 'initialState', 'selectors']

//------------ private utils start---------------

// ----------
// Cache
// ----------
let _cache = {}
const setCacheValue = (namespace, key, value) => {
  set(_cache, [namespace, key], value)
}
const getCacheValue = (namespace, key) => {
  return get(_cache, [namespace, key], null)
}

// ----------
// Preferences
// ----------
let _preferences = {
  loggingEnabled: true,
  defaultSagaEffect: takeLatest,
}
const setPreferences = (pref) => ({ ..._preferences, ...pref })
const getAllPreferences = (pref) => _preferences
const getPrefernces = (propName) => get(_preferences, propName)

// ----------
// Slices
// ----------
let _slices = {}
const storeSlice = (slice) => {
  _slices[slice.name] = slice
}
const getSlice = (sliceName) => _slices[sliceName]

// ----------
// Utils
// ----------

const produceReducerFromSlice = (slice) => {
  const { name, initialState, selectors } = slice
  return (state = initialState, action) => {
    const reducer = getReducerFromAction(slice, action.type)
    if (reducer) {
      const newState = reducer(state, action)
      if (typeof newState === 'undefined') {
        return state
      }
      return newState
    }

    return state
  }
}

const getReducerFromAction = (slice, actionType) => {
  const [sliceName, actionName, step] = actionType.split(ACTION_SEPARATION_CHARS)
  if (sliceName !== slice.name) {
    return undefined
  }
  let reducer = get(slice, [actionName, 'reducer'])
  if (reducer) {
    return reducer
  } else {
    return get(slice, [actionName, step || 'request', 'reducer'])
  }
}

const getAllSagasOfSlice = (slice) => {
  // returns a list of all sagas of a slice
  // [[actionName, handler, sagaEffect]]

  const actions = omit(slice, CONFIG_PROPS_OF_SLICE)
  const sagas = []
  const sliceName = slice.name

  for (let actionName in actions) {
    const action = slice[actionName]
    let saga = get(action, ['saga'])
    if (saga) {
      sagas.push([sliceName + ACTION_SEPARATION_CHARS + actionName, saga, get(action, 'sagaEffect')])
    } else {
      const nestedProps = ['request', 'success', 'failure']
      for (let prop of nestedProps) {
        saga = get(action, [prop, 'saga'])
        if (saga) {
          sagas.push([sliceName + ACTION_SEPARATION_CHARS + actionName + ACTION_SEPARATION_CHARS + prop, saga, get(action, [prop, 'sagaEffect'])])
        }
      }
    }
  }
  return sagas
}

const getHandlerPath = (sliceName, actionName, step) => {
  const slice = getSlice(sliceName)

  // returns null or path [actionName, step]
  let handler = get(slice, [actionName], {})

  if (handler.reducer || handler.saga) {
    return [actionName]
  } else {
    step = step || 'request'
    return [actionName, step]
  }
}

const produceAction = (sliceName, actionName, step) => {
  return (payload) => {
    const cacheKey = [sliceName, actionName, step || ''].join('')
    let value = getCacheValue('produceAction', cacheKey)
    if (!value) {
      let path = getHandlerPath(sliceName, actionName, step)
      value = [sliceName, ...path].join(ACTION_SEPARATION_CHARS)
      setCacheValue(produceAction, cacheKey, value)
    }
    return {
      type: value,
      payload,
    }
  }
}

let _actionProxies = {}
const _getActionsProxyHandler = {
  get(target, actionName, receiver) {
    return (payload, step) => {
      return produceAction(target.name, actionName, step)(payload)
    }
  },
}
let _useActionProxies = {}

const _useActionsProxyHandler = {
  get(target, actionName, receiver) {
    return (payload, step) => {
      const { sliceName, dispatch } = target
      const actions = getActions(sliceName)
      const action = actions[actionName]
      dispatch(action(payload, step))
    }
  },
}
//------------ private utils end---------------

//------------ Public APIs ---------------

// ---------------
// setup
// ---------------
const setup = () => {}

// ---------------
// create slice
// ---------------
const createSlice = (s) => s

// ---------------
// configureStore
// ---------------
const configureStore = (...slices) => {
  let reducers = {}
  let allSagas = [] //[[actionName, handler, sagaEffect]]
  let sagasToRun = []

  for (let slice of slices) {
    reducers[slice.name] = produceReducerFromSlice(slice)
    allSagas = allSagas.concat(getAllSagasOfSlice(slice))
    storeSlice(slice)
  }

  for (let saga of allSagas) {
    sagasToRun.push(function* () {
      const effect = saga[2] || takeLatest
      yield effect(saga[0], saga[1])
    })
    // sagasToRun.push(function* () {
    //   yield takeLatest(saga[0], saga[1])
    // })
  }

  const middlewares = []
  const sagaMiddleWare = createSagaMiddleWare()
  middlewares.push(sagaMiddleWare)
  if (getPrefernces('loggingEnabled')) {
    middlewares.push(
      createLogger({
        logErrors: true,
      }),
    )
  }
  const store = createStore(combineReducers(reducers), applyMiddleware(...middlewares))
  sagasToRun.forEach(sagaMiddleWare.run)
  return store
}

// ---------------
// getActions
// ---------------
const getActions = (sliceName) => {
  /**
   * egs:
   * REQUEST: getAction('user').authenticate()
   * SUCCESS: getAction('user').authenticate(data,'success')
   * FAILURE: getAction('user').authenticate(data,'failure')
   */
  if (!_actionProxies[sliceName]) {
    _actionProxies[sliceName] = new Proxy(getSlice(sliceName), _getActionsProxyHandler)
  }
  return _actionProxies[sliceName]
}

// ---------------
// useActions
// ---------------
const useActions = (sliceName) => {
  /**
   * const {authenticate} = useActions('user')
   * authenticate(payload)
   * authenticate(payload,'success')
   * authenticate(payload,'failure')
   */
  const dispatch = useDispatch()
  if (!_useActionProxies[sliceName]) {
    _useActionProxies[sliceName] = new Proxy({ sliceName, dispatch }, _useActionsProxyHandler)
  }
  return _useActionProxies[sliceName]
}

const useStateService = () => {
  return null
}

export { setup, createSlice, configureStore, useActions, useStateService, getActions }
