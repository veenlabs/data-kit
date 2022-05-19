import { ASYNC_SERVICE_HANDLER_TYPE } from '../helpers/const'
import { get, identity } from '../helpers/lodash'

const getActionTypeFromPath = (path = []) => {
  return path.join('::')
}
const getPathFromActionType = (actionType = '') => {
  return actionType.split('::')
}

const handlerHasStages = (handler = {}) => {
  if (Object.keys(handler).some((k) => getHandlerStages().indexOf(k) > -1)) {
    return true
  }
  return false
}

const isObjectReactSyntheticEvent = (obj) => {
  return get(obj, ['constructor', 'name']) === 'SyntheticBaseEvent'
}

const produceAction = (type, payload) => {
  return {
    type,
    payload: isObjectReactSyntheticEvent(payload) ? null : payload,
  }
}

const isHandlerAPIRequest = (handler) => handler.__type === ASYNC_SERVICE_HANDLER_TYPE
const isHandlerComplexAPIRequest = (handler) => Array.isArray(handler) && handler.length > 0 && isHandlerAPIRequest(handler[0])
const getHandlerStages = () => ['request', 'success', 'failure']
const getHandlerProps = () => ['reducer', 'saga', 'extraOptions']
const getStageNameSuccess = () => getHandlerStages()[1]
const getStageNameRequest = () => getHandlerStages()[0]
const getStageNameFailure = () => getHandlerStages()[2]

const arrayToObject = (arr = [], producerFn = identity) => {
  return arr.reduce((a, c) => {
    a[c] = producerFn(c)
    return a
  }, {})
}

export {
  getActionTypeFromPath,
  getPathFromActionType,
  handlerHasStages,
  isObjectReactSyntheticEvent,
  isHandlerAPIRequest,
  isHandlerComplexAPIRequest,
  produceAction,
  getHandlerStages,
  getHandlerProps,
  getStageNameSuccess,
  getStageNameRequest,
  getStageNameFailure,
  arrayToObject,
}
