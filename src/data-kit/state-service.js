import { createStore, combineReducers, applyMiddleware } from 'redux'
import { useDispatch } from 'react-redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleWare from 'redux-saga'
import { put, takeLatest, select, call, all } from 'redux-saga/effects'
import { default as isFunction } from 'lodash/isFunction'
import { default as omit } from 'lodash/omit'
import { default as get } from 'lodash/get'

//------------ Config ---------------

const ACTION_SEPARATION_CHARS = ':@'
const CONFIG_PROPS_OF_SLICE = ['name', 'initialState', 'selectors']

//------------ private utils start---------------

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
      return newState
    }

    return state
  }
}

// @todo: Buggy
const getReducerFromAction = (slice, actionType) => {
  const [sliceName, action, step] = actionType.split(ACTION_SEPARATION_CHARS)

  //
  if (sliceName !== slice.name) {
    return undefined
  }
  const handler = get(slice, [action])
  const isHandlerFn = isFunction(handler)
  //@todo. It should not be api service
  if (isHandlerFn) {
    return handler
  }
  return get(slice, [action, step, 'reducer'])
}

// @todo: Buggy
const produceAction = (sliceName, actionName, step) => {
  let type = ''
  const slice = getSlice(sliceName)
  const handler = get(slice, [actionName])
  //@todo. It should not be api service
  const isHandlerFn = isFunction(handler)

  if (isHandlerFn) {
    type = actionName
  } else {
    step = step ? step : 'request'
    type = actionName + ACTION_SEPARATION_CHARS + step
  }

  return (payload) => {
    return {
      type: sliceName + ACTION_SEPARATION_CHARS + type,
      payload,
    }
  }
}

const getAllSagasOfSlice = (slice) => {
  // returns a list of sagas of a slice
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
          sagas.push([sliceName + ACTION_SEPARATION_CHARS + actionName + ACTION_SEPARATION_CHARS + prop, saga, get(action, prop, 'sagaEffect')])
        }
      }
    }
  }
  return sagas
}
//------------ private utils end---------------

//------------ Public APIs ---------------

const config = () => {}
const createSlice = (s) => s

// ----------
// configureStore
// ----------
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
      console.log(saga[0])
      yield takeLatest(saga[0], saga[1])
    })
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

// Actions proxy start

let _actionProxies = {}
const _getActionsProxyHandler = {
  get(target, actionName, receiver) {
    return (payload, step) => {
      return produceAction(target.name, actionName, step)(payload)
    }
  },
}
const getActions = (sliceName) => {
  /**
     * egs:
    // REQUEST: getAction('user').authenticate() 
    // SUCCESS: getAction('user').authenticate(data,'success')
    // FAILURE: getAction('user').authenticate(data,'failure')
     */
  if (!_actionProxies[sliceName]) {
    _actionProxies[sliceName] = new Proxy(getSlice(sliceName), _getActionsProxyHandler)
  }
  return _actionProxies[sliceName]
}

// Actions proxy end

// USE_Actions proxy start

let _useActionProxies = {}

const _useActionsProxyHandler = {
  /**
   * const {authenticate} = useActions('user')
   * authenticate(payload)
   * authenticate(payload,'success')
   * authenticate(payload,'failure')
   */
  get(target, actionName, receiver) {
    return (payload, step) => {
      const { sliceName, dispatch } = target
      const actions = getActions(sliceName)
      const action = actions[actionName]
      dispatch(action(payload, step))
    }
  },
}
const useActions = (sliceName) => {
  const dispatch = useDispatch()
  if (!_useActionProxies[sliceName]) {
    _useActionProxies[sliceName] = new Proxy({ sliceName, dispatch }, _useActionsProxyHandler)
  }
  return _useActionProxies[sliceName]
}

// USE_Actions proxy end

const useStateService = () => {
  return null
}

export { config, createSlice, configureStore, useActions, useStateService, getActions }

// const user = {
//     a:{
//         b:{
//             c:1
//         }
//     }
// }

// console.log(get(user,['a','b','c']))
