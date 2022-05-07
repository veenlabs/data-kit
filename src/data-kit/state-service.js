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

// 1
const produceReducerForSlice = (slice) => {
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

// 2
const getReducerFromAction = (slice, actionType) => {
  const [sliceName, actionName, step] = actionType.split(ACTION_SEPARATION_CHARS)
  if (sliceName !== slice.name) {
    return undefined
  }
  const path = getHandlerPath(sliceName, actionName, step)
  let reducer = get(slice, [...path, 'reducer'])
  return reducer
}

// 5
const getAllSagasOfSlice = (slice) => {
  // returns a list of all sagas of a slice
  // [[actionName, handler, sagaEffect]]

  const actions = omit(slice, CONFIG_PROPS_OF_SLICE)
  const sagas = []
  const sliceName = slice.name

  for (let actionName in actions) {
    const steps = [undefined, 'request', 'success', 'failure']

    let pushedTypes = {}

    for (let step of steps) {
      const path = getHandlerPath(sliceName, actionName, step)
      const saga = get(slice, [...path, 'saga'])
      if (saga) {
        const type = produceAction(sliceName, actionName, step)().type
        if (!pushedTypes[type]) {
          sagas.push([type, saga, get(get(slice, [...path, 'sagaEffect']))])
          pushedTypes[type] = type
        }
      }
    }
  }
  return sagas
}

// 3
const getHandlerPath = (sliceName, actionName, step) => {
  // returns null or path [actionName, step]
  const cacheKey = [sliceName, actionName, step || ''].join('')
  let value = getCacheValue('getHandlerPath', cacheKey)
  if (value) {
    return value
  }

  const slice = getSlice(sliceName)

  let handler = get(slice, [actionName], {})

  if (handler.reducer || handler.saga) {
    value = [actionName]
  } else {
    step = step || 'request'
    value = [actionName, step]
  }
  setCacheValue('getHandlerPath', cacheKey, value)
  return value
}

// 4
const produceAction = (sliceName, actionName, step) => {
  return (payload) => {
    const cacheKey = [sliceName, actionName, step || ''].join('')
    let value = getCacheValue('produceAction', cacheKey)
    if (!value) {
      let path = getHandlerPath(sliceName, actionName, step)
      console.log({ path, sliceName, actionName, step })
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
    reducers[slice.name] = produceReducerForSlice(slice)
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
