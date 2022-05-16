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

export { getActionTypeFromPath, getPathFromActionType, handlerHasSteps }
