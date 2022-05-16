import { get } from '../helpers/lodash'

const getActionTypeFromPath = (path = []) => {
  return path.join('::')
}
const getPathFromActionType = (actionType = '') => {
  return actionType.split('::')
}

const handlerHasSteps = (handler) => {
  if (Object.keys(handler).some((k) => ['request', 'failure', 'success'].indexOf(k) > -1)) {
    return true
  } else if (handler.stepsInFuture) {
    return true
  }
  return false
}

const isObjectReactSyntheticEvent = (obj) => {
  return get(obj, ['constructor', 'name']) === 'SyntheticBaseEvent'
}

export { getActionTypeFromPath, getPathFromActionType, handlerHasSteps, isObjectReactSyntheticEvent }
