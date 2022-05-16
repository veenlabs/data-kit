import produce from 'immer'
import { call, put, takeLatest } from 'redux-saga/effects'
import { ASYNC_SERVICE_HANDLER_TYPE, CACHE_NAMESPACES, STATE_SERVICE_RESET_ACTION } from '../helpers/const'
import { get } from '../helpers/lodash'
import { setCache } from '../helpers/cache'
import { getPreferences } from './setup'
import actionsProxyHandler from './actionCreatorProxyHandler'
import { getActionTypeFromPath, getPathFromActionType } from './utils'

const handlerHasSteps = (handler) => {
  if (Object.keys(handler).some((k) => ['request', 'failure', 'success'].indexOf(k) > -1)) {
    return true
  } else if (handler.stepsInFuture) {
    return true
  }
  return false
}

const isValueAHandler = (value) => Object.keys(value).some((k) => ['reducer', 'saga', 'extraOptions'].indexOf(k) > -1)
const isHandlerAPIRequest = (handler) => handler.__type === ASYNC_SERVICE_HANDLER_TYPE
const isHandlerComplexAPIRequest = (handler) => Array.isArray(handler) && handler.length > 0 && isHandlerAPIRequest(handler[0])

function formatHandler(sliceName, actionName, handler) {
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
  if (isValueAHandler(handler)) {
    return handler
  }
  // case 2
  // {
  //     actions:{
  //         getUser:{
  //             request:{
  //                 reducer : ()=>{},
  //                 saga: function*(){}
  //             },
  //             success:{
  //                 reducer : ()=>{},
  //             },
  //         }
  //     }
  // }
  else if (handlerHasSteps(handler)) {
    // format each step
    let keys = Object.keys(handler)
    for (let key of keys) {
      handler[key] = formatHandler(sliceName, actionName, handler[key])
    }
    return handler
  }
  // case 3
  // {
  //     actions:{
  //         getUser: asyncService.getUser
  //         getUser2: [asyncService.getUser, takeLatest]
  //     }
  // }
  else if (isHandlerAPIRequest(handler) || isHandlerComplexAPIRequest(handler)) {
    let action = handler
    let sagaEffect = getPreferences('defaultSaga')
    if (isHandlerComplexAPIRequest(handler)) {
      action = handler[0]
      sagaEffect = handler[1] || sagaEffect
    }
    return {
      request: {
        saga: function* () {
          let path = [slice.name, actionName, 'success']
          const result = yield call(action)
          yield put({
            type: getActionTypeFromPath(path),
            payload: result,
          })
        },
        sagaEffect,
      },
      success: {
        reducer: (action, { payload }) => payload,
      },
    }
  }
}

const getAllSagas = (sliceName, formattedActions, stepName) => {
  let sagas = []
  let actionNames = Object.keys(formattedActions)
  for (let actionName of actionNames) {
    let handler = formattedActions[actionName]
    if (handler.saga) {
      let path = [sliceName, actionName]
      if (stepName) {
        path.push(stepName)
      }
      const actionType = getActionTypeFromPath(path)
      sagas = sagas.concat([[actionType, handler.saga, handler.sagaEffect]])
    } else if (handlerHasSteps(handler)) {
      let stepNames = Object.keys(handler)
      for (let stepName of stepNames) {
        let sagasOfStep = getAllSagas(sliceName, handler[stepName], stepName)
        sagas = sagas.concat(sagasOfStep)
      }
    }
  }
  return sagas
}

const formatActions = (sliceName, actions) => {
  const formattedActions = Object.keys(actions).reduce((acc, actionName) => {
    acc[actionName] = formatHandler(sliceName, actionName, actions[actionName])
    return acc
  }, {})
  return formattedActions
}

const createReducer = (initialState) => {
  const reducer = (state = initialState, action) => {
    if (action.type === STATE_SERVICE_RESET_ACTION) {
      return initialState
    } else {
      const path = getPathFromActionType(action.type)
      // [sliceName, actionName, step]
      path.push('reducer')
      const reducer = get(formatActions, path, null)
      if (reducer) {
        // const newState = reducer(state, action)
        const newState = produce(state, (draft) => reducer(draft, action))
        if (typeof newState === 'undefined') {
          return state
        }
        return newState
      }
    }
    return state
  }
  return reducer
}

function createSlice(slice = {}) {
  setCache(CACHE_NAMESPACES.STATE_SERVICE_RAW_SLICES, slice.name, slice)
  const { name = null, initialState = null, selectors = {}, actions = {} } = slice

  const formattedActions = formatActions(name, actions)
  const sagas = getAllSagas(name, formattedActions)
  const reducer = createReducer(initialState)

  return Object.freeze({
    name,
    sagas: sagas,
    selectors: selectors,
    reducer: reducer,
    actions: new Proxy({ slice }, actionsProxyHandler),
  })
}

export default createSlice
