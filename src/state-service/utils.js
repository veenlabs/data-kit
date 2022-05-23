import { ASYNC_SERVICE_HANDLER_TYPE } from '../helpers/const'
import { get } from '../helpers/lodash'

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

const isHandlerAnAsyncOperation = (handler) => handler.__type === ASYNC_SERVICE_HANDLER_TYPE || get(handler, ['constructor', 'name']) === 'AsyncFunction'
const isHandlerAnComplexAsyncOperation = (handler) => Array.isArray(handler) && handler.length > 0 && isHandlerAnAsyncOperation(handler[0])

const getHandlerStages = () => ['request', 'success', 'failure']
const getHandlerProps = () => ['reducer', 'saga', 'extraOptions']
const getStageNameSuccess = () => getHandlerStages()[1]
const getStageNameRequest = () => getHandlerStages()[0]
const getStageNameFailure = () => getHandlerStages()[2]

export {
  getActionTypeFromPath,
  getPathFromActionType,
  handlerHasStages,
  isObjectReactSyntheticEvent,
  produceAction,
  getHandlerStages,
  getHandlerProps,
  getStageNameSuccess,
  getStageNameRequest,
  getStageNameFailure,
  isHandlerAnAsyncOperation,
  isHandlerAnComplexAsyncOperation,
}
