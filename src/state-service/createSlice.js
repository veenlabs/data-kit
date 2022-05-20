import produce from 'immer'
import { call, put, takeLatest } from 'redux-saga/effects'
import { CACHE_NAMESPACES, STATE_SERVICE_RESET_ACTION_STATE } from '../helpers/const'
import { get } from '../helpers/lodash'
import { setCache } from '../helpers/cache'
import { getAllPreferences, getPreferences } from './setup'
import {
  getActionTypeFromPath,
  getHandlerProps,
  getPathFromActionType,
  getStageNameFailure,
  getStageNameRequest,
  getStageNameSuccess,
  handlerHasStages,
  isHandlerAPIRequest,
  isHandlerComplexAPIRequest,
  produceAction,
} from './utils'
import getActions from './getActions'

const successStageName = getStageNameSuccess()
const requestStageName = getStageNameRequest()
const failureStageName = getStageNameFailure()

function commonSaga(saga, extraOptions, handlerPath) {
  return function* (action) {
    const { beforeHandleSaga, afterSuccessHandleSaga, afterFailHandleSaga } = getAllPreferences()
    if (beforeHandleSaga) {
      yield beforeHandleSaga(action, extraOptions)
    }
    try {
      yield saga(action)
      if (afterSuccessHandleSaga) {
        yield afterSuccessHandleSaga(action, extraOptions)
      }
    } catch (error) {
      console.log(error)
      yield put({ type: getActionTypeFromPath([...handlerPath, failureStageName]) })
      if (afterFailHandleSaga) {
        yield afterFailHandleSaga(action, extraOptions)
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
  } else if (isHandlerAPIRequest(handler) || isHandlerComplexAPIRequest(handler)) {
    // case 2
    // {
    //     actions:{
    //         getUser: asyncService.getUser
    //         getUser2: [asyncService.getUser, takeLatest]
    //     }
    // }
    let action = handler
    let sagaEffect = getPreferences('defaultSaga')
    if (isHandlerComplexAPIRequest(handler)) {
      action = handler[0]
      sagaEffect = handler[1] || sagaEffect
    }
    return {
      request: {
        // this saga is auto generated
        saga: function* ({ payload }) {
          let result = yield call(action, payload)
          let path = [sliceName, actionName, successStageName]
          yield put(produceAction(getActionTypeFromPath(path), result))
        },
        sagaEffect,
      },
      success: {
        // this reducer is auto generated
        reducer: (action, { payload }) => payload,
      },
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
    if (isHandlerAPIRequest(requestHandler) || isHandlerComplexAPIRequest(requestHandler)) {
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
  // @todo: This has to be removed
  setCache(CACHE_NAMESPACES.STATE_SERVICE_RAW_SLICES, slice.name, slice)
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
