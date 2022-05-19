import { useDispatch } from 'react-redux'
import { getCache } from '../helpers/cache'
import { CACHE_NAMESPACES } from '../helpers/const'
import { get } from '../helpers/lodash'
import { arrayToObject, getActionTypeFromPath, getHandlerStages, getStageNameRequest, handlerHasStages, produceAction } from './utils'

const requestStageName = getStageNameRequest()
// const successStageName = getStageNameSuccess()
// const failureStageName = getStageNameFailure()
const stagesObjects = arrayToObject(getHandlerStages())

function _getActions(params, dispatch) {
  const stringPattern = typeof params === 'string' ? params : params.name
  const [sliceName, actionName, stageName] = stringPattern.split(':')

  // if stage is defined it is assumed that sliceName and actionNames are also defined
  if (stageName) {
    return (data) => {
      const path = [sliceName, actionName, stageName]
      const actionType = getActionTypeFromPath(path)
      const act1 = produceAction(actionType, data)
      dispatch && dispatch(act1)
      return act1
    }
  } else if (actionName) {
    const path = [sliceName, actionName]
    const formattedSliceActions = getCache(CACHE_NAMESPACES.STATE_SERVICE_FORMATTED_ACTIONS, sliceName)
    const hasStages = handlerHasStages(get(formattedSliceActions, [actionName]))
    const actionCreator = (data) => {
      const actionType = hasStages ? getActionTypeFromPath([...path, requestStageName]) : getActionTypeFromPath(path)
      const act1 = produceAction(actionType, data)
      dispatch && dispatch(act1)
      return act1
    }
    if (hasStages) {
      const stageActions = new Proxy(stagesObjects, {
        get(target, stageProp) {
          return (data) => {
            const actionType = getActionTypeFromPath([...path, stageProp])
            const act1 = produceAction(actionType, data)
            dispatch && dispatch(act1)
            return act1
          }
        },
      })
      Object.assign(actionCreator, stageActions)
    }
    return actionCreator
  }
  return new Proxy(
    {
      sliceName,
    },
    {
      get({ sliceName }, prop) {
        return _getActions(`${sliceName}:${prop}`, dispatch)
      },
    },
  )
}

function getActions(params) {
  return _getActions(params, null)
}

function useActions(params) {
  const dispatch = useDispatch()
  return _getActions(params, dispatch)
}

export { getActions }
export default useActions

// const actions = useActions('user')
// actions.authenticate()
// actions.authenticate.request()
// actions.authenticate.success()
