import produce from 'immer'
import { call, put, takeLatest } from 'redux-saga/effects'
import { CACHE_NAMESPACES, STATE_SERVICE_RESET_ACTION_STATE } from '../helpers/const'
import { get, identity, set } from '../helpers/lodash'
import { setCache } from '../helpers/cache'
import { getAllPreferences, getPreferences } from './setup'
import {
  formatRequestPayload,
  getActionTypeFromPath,
  getHandlerProps,
  getPathFromActionType,
  getStageNameFailure,
  getStageNameRequest,
  getStageNameSuccess,
  handlerHasStages,
  isHandlerAnAsyncOperation,
  isHandlerAnComplexAsyncOperation,
  produceAction,
} from './utils'
import getActions from './getActions'

const successStageName = getStageNameSuccess()
const requestStageName = getStageNameRequest()
const failureStageName = getStageNameFailure()

function commonSaga(saga, extraOptions, handlerPath) {
  return function* (action) {
    const { beforeHandleSaga, afterSuccessHandleSaga, afterFailHandleSaga, formatSagaError = identity } = getAllPreferences()
    const { callback, data } = formatRequestPayload(get(action, 'payload'))
    set(action, 'payload', { callback, data })
    if (beforeHandleSaga) {
      yield beforeHandleSaga(action, extraOptions)
    }
    try {
      const result = yield saga(action)
      if (afterSuccessHandleSaga) {
        yield afterSuccessHandleSaga(action, extraOptions, result)
      }
      try {
        callback(true, result)
      } catch (error) {
        console.log('Error thrown at: Success callback', get(action, 'type'), error)
      }
    } catch (error) {
      console.warn('Failed at saga', error)
      let formattedErrors = error
      try {
        formattedErrors = formatSagaError(error)
      } catch (error) {
        console.log('Error thrown while formatting sagaErrors at: formatSagaError, ', get(action, 'type'), error)
      }
      if (afterFailHandleSaga) {
        yield afterFailHandleSaga(action, extraOptions, error, formattedErrors)
      }
      yield put({ type: getActionTypeFromPath([...handlerPath, failureStageName]) })
      try {
        callback(false, formattedErrors)
      } catch (error) {
        console.log('Error thrown at: Faill callback', get(action, 'type'))
      }
    }
  }
}

const getAllSagas = (sliceName, formattedActions) => {
  let sagas = []
  let actionNames = Object.keys(formattedActions)

  for (let actionName of actionNames) {
    let handler = formattedActions[actionName]

    let path = [sliceName, actionName]
    if (handler.saga) {
      const actionType = getActionTypeFromPath(path)
      const wrappedSaga = commonSaga(handler.saga, handler.extraOptions, path)
      sagas = sagas.concat([[actionType, wrappedSaga, handler.sagaEffect]])
    } else if (handlerHasStages(handler)) {
      let stageNames = Object.keys(handler)
      for (let stageName of stageNames) {
        const stageHandler = handler[stageName]
        if (stageHandler.saga) {
          const stagePath = [...path, stageName]
          const wrappedSaga = commonSaga(stageHandler.saga, stageHandler.extraOptions, path)
          const actionType = getActionTypeFromPath(stagePath)
          sagas = sagas.concat([[actionType, wrappedSaga, stageHandler.sagaEffect]])
        }
      }
    }
  }

  return sagas
}

const isValueAHandler = (value) => Object.keys(value).some((k) => getHandlerProps().indexOf(k) > -1)

const caller2 = async (fn2, data) => {
  return await fn2(data)
}

function formatHandler(sliceName, actionName, handler) {
  /**
   * This method will eventually format all handler into below tree structure
   * {
   * * handler:{reducer,saga},
   * * handler: {
   *      request:{reducer,saga},
   *      success:{reducer,saga},
   *      failure:{reducer,saga},
   * * }
   * }
   */
  if (isValueAHandler(handler)) {
    // case 1
    // {
    //     actions:{
    //         getUser:{
    //             reducer:()=>{},
    //             saga:()=>{},
    //             extraOptions:()=>{},
    //         }
    //     }
    // }
    return handler
  } else if (isHandlerAnAsyncOperation(handler) || isHandlerAnComplexAsyncOperation(handler)) {
    // case 2
    // {
    //     actions:{
    //         getUser: asyncService.getUser
    //         getUser2: [asyncService.getUser, takeLatest]
    //     }
    // }
    let action = handler
    let sagaEffect = getPreferences('defaultSaga')
    let addSuccReducer = true
    let reducerPath = null
    let successReducer = {}
    let formatResponse = identity
    if (isHandlerAnComplexAsyncOperation(handler)) {
      action = handler[0]
      const sagaOptions = handler[1]
      sagaEffect = get(sagaOptions, 'sagaEffect', sagaEffect)
      addSuccReducer = !get(sagaOptions, 'noReducer', false)
      reducerPath = get(sagaOptions, 'reducerPath', '')
      formatResponse = get(sagaOptions, 'formatResponse', identity)
    }
    if (addSuccReducer) {
      successReducer = {
        success: {
          // this reducer is auto generated
          reducer: (draft, { payload }) => set(draft, reducerPath, formatResponse(payload)),
        },
      }
    }
    return {
      request: {
        // this saga is auto generated
        saga: function* ({ payload }) {
          // it is guaranteed by comman saga that payload will have callback and data
          const { data } = payload
          let result = yield call(caller2, action, data)
          // let result = yield call(action, payload)
          let path = [sliceName, actionName, successStageName]
          yield put(produceAction(getActionTypeFromPath(path), result))
          return result
        },
        sagaEffect,
      },
      ...successReducer,
      failure: {
        saga: function* () {
          console.log('@Todo: Remove this saga---->AUTO FAIL')
        },
      },
    }
  } else if (handlerHasStages(handler)) {
    // case 3
    // {
    //     actions:{
    //         getUser:{
    //             request: AsyncService.GetSome,
    //             success:{
    //                 reducer : ()=>{},
    //             },
    //         }
    //     }
    // }

    // in this case we are we check whether request stage is AsyncService or not.
    // If yes then using recurrsion we get {request, success, failure}
    // We replace request, but if user has defined any of {success, failure} we use it
    const requestHandler = get(handler, [requestStageName])
    if ((requestHandler && isHandlerAnAsyncOperation(requestHandler)) || isHandlerAnComplexAsyncOperation(requestHandler)) {
      const { request, success, failure } = formatHandler(sliceName, actionName, requestHandler)
      handler.request = request
      handler.success = handler.success || success
      handler.failure = handler.failure || failure
    }
    return handler
  }
  return handler
}

const formatActions = (sliceName, actions) => {
  let formattedActions = {}
  for (let actionName in actions) {
    formattedActions[actionName] = formatHandler(sliceName, actionName, actions[actionName])
  }
  return formattedActions
}

const createReducer = (initialState, sliceName, formattedActions) => {
  const reducer = (state = initialState, action) => {
    // payload should be either state_reset or it should be same as sliceName
    if (action.type === STATE_SERVICE_RESET_ACTION_STATE && (action.payload === STATE_SERVICE_RESET_ACTION_STATE || action.payload === sliceName)) {
      return initialState
    } else {
      const [sliceName2, ...path] = getPathFromActionType(action.type)
      if (sliceName === sliceName2) {
        path.push('reducer')
        const _reducer = get(formattedActions, path, null)
        if (_reducer) {
          // const newState = _reducer(state, action)
          try {
            const newState = produce(state, (draft) => _reducer(draft, action))
            if (typeof newState === 'undefined') {
              return state
            }
            return newState
          } catch (error) {
            console.warn(`Error in sliceName:${sliceName}`, path, error)
          }
        }
      }
    }
    return state
  }
  return reducer
}

function createSlice(slice = {}) {
  const { name = null, initialState = null, selectors = {}, actions = {} } = slice

  const formattedActions = formatActions(name, actions)
  const sagas = getAllSagas(name, formattedActions)
  const reducer = createReducer(initialState, name, formattedActions)

  setCache(CACHE_NAMESPACES.STATE_SERVICE_FORMATTED_ACTIONS, slice.name, formattedActions)
  setCache(CACHE_NAMESPACES.STATE_SERVICE_SLICE_SELECTORS, slice.name, selectors)

  return Object.freeze({
    name,
    sagas: sagas,
    selectors: selectors,
    reducer: reducer,
    actions: getActions(name),
  })
}

export default createSlice
