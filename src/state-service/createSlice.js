import produce from 'immer'
import { call, put, takeLatest } from 'redux-saga/effects'
import { ASYNC_SERVICE_HANDLER_TYPE, CACHE_NAMESPACES, STATE_SERVICE_RESET_ACTION } from '../helpers/const'
import { get } from '../helpers/lodash'
import { setCache } from '../helpers/cache'
import { getPreferences } from './setup'
import actionsProxyHandler from './actionCreatorProxyHandler'
import { getActionTypeFromPath, getPathFromActionType, handlerHasSteps } from './utils'

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
        // this saga is auto generated
        saga: function* ({ payload }) {
          let path = [sliceName, actionName, 'success']
          let result = yield call(action, payload)
          yield put({
            type: getActionTypeFromPath(path),
            payload: result,
          })
        },
        sagaEffect,
      },
      success: {
        // this reducer is auto generated
        reducer: (action, { payload }) => payload,
      },
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
      sagas = sagas.concat([[actionType, handler.saga, handler.sagaEffect]])
    } else if (handlerHasSteps(handler)) {
      let stepNames = Object.keys(handler)
      for (let stepName of stepNames) {
        const stepHandler = handler[stepName]
        if (stepHandler.saga) {
          // extra saga for first step
          if (stepName === 'request') {
            const actionType = getActionTypeFromPath(path)
            sagas = sagas.concat([[actionType, stepHandler.saga, stepHandler.sagaEffect]])
          }

          path.push(stepName)
          const actionType = getActionTypeFromPath(path)
          sagas = sagas.concat([[actionType, stepHandler.saga, stepHandler.sagaEffect]])
        }
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

const createReducer = (initialState, sliceName, formattedActions) => {
  const reducer = (state = initialState, action) => {
    if (action.type === STATE_SERVICE_RESET_ACTION) {
      return initialState
    } else {
      const [sliceName2, ...path] = getPathFromActionType(action.type)
      if (sliceName === sliceName2) {
        path.push('reducer')
        const _reducer = get(formattedActions, path, null)
        if (_reducer) {
          // const newState = _reducer(state, action)
          const newState = produce(state, (draft) => _reducer(draft, action))
          if (typeof newState === 'undefined') {
            return state
          }
          return newState
        }
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
  const reducer = createReducer(initialState, name, formattedActions)

  return Object.freeze({
    name,
    sagas: sagas,
    selectors: selectors,
    reducer: reducer,
    actions: new Proxy({ slice }, actionsProxyHandler),
  })
}

export default createSlice
