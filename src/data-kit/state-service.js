import { createStore, combineReducers, applyMiddleware } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleWare from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import { default as omit } from 'lodash/omit'
import { default as get } from 'lodash/get'
import { default as set } from 'lodash/set'
import produce from 'immer'

//------------ Config ---------------

const ACTION_SEPARATION_CHARS = ':@'
const RESET_ACTION_TYPE = '__lib_reset'
const CONFIG_PROPS_OF_SLICE = ['name', 'initialState', 'selectors']
let DEFAULT_PREFERENCES = {
  loggingEnabled: true,
  defaultSagaEffect: takeLatest,
}

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

const setPreferences = (prefs) => {
  setCacheValue('app', 'preferences', { ...DEFAULT_PREFERENCES, prefs })
}
const getAllPreferences = () => getCacheValue('app', 'preferences') || DEFAULT_PREFERENCES
const getPreferences = (propName) => get(getAllPreferences(), propName)

// ----------
// Slices
// ----------
const storeSlice = (slice) => setCacheValue('slices', slice.name, slice)
const getSlice = (sliceName) => getCacheValue('slices', sliceName)

// ----------
// Utils
// ----------

// 1
const produceReducerForSlice = (slice) => {
  const { name, initialState, selectors } = slice
  return (state = initialState, action) => {
    if (action.type === RESET_ACTION_TYPE) {
      return initialState
    } else {
      const reducer = getReducerFromAction(slice, action.type)
      if (reducer) {
        // const newState = reducer(state, action)
        const newState = produce(state, (draft) => reducer(draft, action))
        if (typeof newState === 'undefined') {
          return state
        }
        return newState
      }

      return state
    }
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

// Saga Wrapper. This wraps user sagas
function commonSaga(saga, processors, extraOptions) {
  return function* (request) {
    const { beforeHandleSaga, afterSuccessHandleSaga, afterFailHandleSaga } = processors
    if (beforeHandleSaga) {
      yield beforeHandleSaga(request, extraOptions)
    }
    try {
      yield saga(request)
      if (afterSuccessHandleSaga) {
        yield afterSuccessHandleSaga(request, extraOptions)
      }
    } catch (error) {
      console.log(error)
      if (afterFailHandleSaga) {
        yield afterFailHandleSaga(request, extraOptions)
      }
    }
  }
}

// 5
const getAllSagasOfSlice = (slice) => {
  // returns a list of all sagas of a slice
  // [[actionName, handler, sagaEffect]]

  const actions = omit(slice, CONFIG_PROPS_OF_SLICE)
  const sagas = []
  const sliceName = slice.name

  const { beforeHandleSaga, afterSuccessHandleSaga, afterFailHandleSaga } = getCacheValue('setup', 'setup') || {}
  const processors = { beforeHandleSaga, afterSuccessHandleSaga, afterFailHandleSaga }
  for (let actionName in actions) {
    const steps = [undefined, 'request', 'success', 'failure']

    let pushedTypes = {}

    for (let step of steps) {
      const path = getHandlerPath(sliceName, actionName, step)
      const saga = get(slice, [...path, 'saga'])
      const extraOptions = get(slice, [...path, 'extraOptions'])
      if (saga) {
        const type = produceAction(sliceName, actionName, step)().type
        if (!pushedTypes[type]) {
          const wrappedSaga = commonSaga(saga, processors, extraOptions)
          sagas.push([type, wrappedSaga, get(get(slice, [...path, 'sagaEffect']))])
          pushedTypes[type] = type
        }
      }
    }
  }
  return sagas
}

const isHandlerAnAPI = (handler) => typeof handler === 'function' && get(handler, '__type') === 'api_service'

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
      value = [sliceName, ...path].join(ACTION_SEPARATION_CHARS)
      setCacheValue(produceAction, cacheKey, value)
    }
    return {
      type: value,
      payload,
    }
  }
}

const getActionsProxyHandler = {
  get(target, actionName, receiver) {
    return (payload, step) => {
      return produceAction(target.name, actionName, step)(payload)
    }
  },
}

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
const setup = (setupProps) => {
  /**
   * setupProps :{
   *  beforeHandleSaga: function*(){}
   *  afterSuccessHandleSaga: function*(){}
   *  afterFailHandleSaga: function*(){}
   * }
   */
  setCacheValue('setup', 'setup', setupProps)
}

// ---------------
// create slice
// ---------------
const createSlice = (slice) => {
  const _createSaga = (actionName, apiService) => {
    const saga = function* () {
      const result = yield call(apiService)
      let path = [slice.name, actionName, 'success']
      yield put({
        type: path.join(ACTION_SEPARATION_CHARS),
        payload: result,
      })
    }
    return saga
  }

  const actions = omit(slice, CONFIG_PROPS_OF_SLICE)
  for (let actionName in actions) {
    const action = actions[actionName]
    // handler is top level api call
    if (isHandlerAnAPI(action)) {
      const saga = _createSaga(actionName, action)
      const reducer = (action, { payload }) => payload
      set(slice, [actionName, 'request', 'saga'], saga)
      set(slice, [actionName, 'success', 'reducer'], reducer)
    } else {
      const requestStep = get(slice, [actionName, 'request'])
      if (isHandlerAnAPI(requestStep)) {
        const saga = _createSaga(actionName, requestStep)
        set(slice, [actionName, 'request', 'saga'], saga)
      }
    }
  }

  return slice
}

// ---------------
// configureStore
// ---------------
const configureStore = (...slices) => {
  let reducers = {}
  let allSagas = [] //[[actionName, handler, sagaEffect]]
  let sagasToRun = []

  for (let slice of slices) {
    storeSlice(slice)
    reducers[slice.name] = produceReducerForSlice(slice)
    allSagas = allSagas.concat(getAllSagasOfSlice(slice))
  }

  for (let saga of allSagas) {
    sagasToRun.push(function* () {
      const effect = saga[2] || takeLatest
      yield effect(saga[0], saga[1])
    })
  }

  const middlewares = []
  const sagaMiddleWare = createSagaMiddleWare()
  middlewares.push(sagaMiddleWare)
  if (getPreferences('loggingEnabled')) {
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
   * REQUEST: getAction('user').authenticate()
   * SUCCESS: getAction('user').authenticate(data,'success')
   * FAILURE: getAction('user').authenticate(data,'failure')
   */
  let value = getCacheValue('getActions', sliceName)
  if (!value) {
    value = new Proxy(getSlice(sliceName), getActionsProxyHandler)
    setCacheValue('getActions', sliceName, value)
  }
  return value
}

// ---------------
// useActions
// ---------------
const useActions = (sliceName) => {
  /**
   * const {authenticate} = useActions('user')
   * REQUEST: authenticate(payload)
   * SUCCESS: authenticate(payload,'success')
   * FAILURE: authenticate(payload,'failure')
   */
  const dispatch = useDispatch()
  let value = getCacheValue('useActions', sliceName)
  if (!value) {
    value = new Proxy({ sliceName, dispatch }, _useActionsProxyHandler)
    setCacheValue('useActions', sliceName, value)
  }
  return value
}

const useReset = () => {
  /**
   * const { reset } = useReset()
   */
  const dispatch = useDispatch()
  return {
    reset: () => {
      dispatch({
        type: RESET_ACTION_TYPE,
      })
    },
  }
}

// ---------------
// use selector
// ---------------

const nullSelector = () => {
  console.warn('Invalid selector')
  return null
}
const useStateSelector = (selectorPath) => {
  const [sliceName, selectorName] = selectorPath.split(':')
  const slice = getSlice(sliceName)
  const selectorFromSlice = get(slice, ['selectors', selectorName], nullSelector)
  const selector = (s) => {
    try {
      return selectorFromSlice(get(s, [sliceName]), s)
    } catch (error) {
      console.warn('Error thrown from selector', selectorPath)
      console.warn(error)
    }
  }
  const result = useSelector(selector)
  return result
}

export { setup, createSlice, configureStore, useActions, useStateSelector, getActions, useReset }
