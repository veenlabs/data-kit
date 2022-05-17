import { ASYNC_SERVICE_HANDLER_TYPE } from '../helpers/const'
import { get } from '../helpers/lodash'

const getActionTypeFromPath = (path = []) => {
  return path.join('::')
}
const getPathFromActionType = (actionType = '') => {
  return actionType.split('::')
}

const handlerHasSteps = (handler = {}) => {
  if (Object.keys(handler).some((k) => ['request', 'failure', 'success'].indexOf(k) > -1)) {
    return true
  }
  return false
}

const isObjectReactSyntheticEvent = (obj) => {
  return get(obj, ['constructor', 'name']) === 'SyntheticBaseEvent'
}

const isHandlerAPIRequest = (handler) => handler.__type === ASYNC_SERVICE_HANDLER_TYPE
const isHandlerComplexAPIRequest = (handler) => Array.isArray(handler) && handler.length > 0 && isHandlerAPIRequest(handler[0])

export { getActionTypeFromPath, getPathFromActionType, handlerHasSteps, isObjectReactSyntheticEvent, isHandlerAPIRequest, isHandlerComplexAPIRequest }
