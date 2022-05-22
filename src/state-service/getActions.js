import { getCache } from '../helpers/cache'
import { CACHE_NAMESPACES } from '../helpers/const'
import { get } from '../helpers/lodash'
import { arrayToObject } from '../helpers/utils'
import { getActionTypeFromPath, getHandlerStages, getStageNameRequest, handlerHasStages, produceAction } from './utils'

const requestStageName = getStageNameRequest()
const stagesObjects = arrayToObject(getHandlerStages())

// Level1 : sliceName
const level1Handler = {
  get({ sliceName, dispatch }, prop) {
    return level2Handler({ sliceName, actionName: prop, dispatch })
  },
}

// Level2 : sliceName:ActionName
const level2Handler = ({ sliceName, actionName, dispatch }) => {
  const path = [sliceName, actionName]
  const formattedSliceActions = getCache(CACHE_NAMESPACES.STATE_SERVICE_FORMATTED_ACTIONS, sliceName)
  const hasStages = handlerHasStages(get(formattedSliceActions, [actionName]))
  const actionCreator = (data) => {
    const actionType = hasStages ? getActionTypeFromPath([...path, requestStageName]) : getActionTypeFromPath(path)
    const act1 = produceAction(actionType, data)
    dispatch && dispatch(act1)
    return act1
  }
  const stageActions = new Proxy(hasStages ? stagesObjects : {}, {
    get(target, stageProp) {
      return (data) => {
        const actionType = getActionTypeFromPath([...path, stageProp])
        const act1 = produceAction(actionType, data)
        dispatch && dispatch(act1)
        return act1
      }
    },
  })
  const extendedActionCreator = Object.assign(actionCreator, stageActions)
  return new Proxy(extendedActionCreator, {
    get(target, prop) {
      if (!target[prop]) {
        return () => {
          console.warn("Invalid Action: this action doesn't exist in slice", { slice: sliceName, actionName, stage: prop })
        }
      } else {
        return target[prop]
      }
    },
  })
}

// Level3 : sliceName:ActionName:Stagename
const level3Handler = ({ sliceName, actionName, stageName, dispatch }) => {
  return (data) => {
    const path = [sliceName, actionName, stageName]
    const action = produceAction(getActionTypeFromPath(path), data)
    if (dispatch) {
      dispatch(action)
    }
    return action
  }
}

const _getActions = (params, dispatch) => {
  const stringPattern = typeof params === 'string' ? params : params.name
  const [sliceName, actionName, stageName] = stringPattern.split(':')

  // if stage is defined it is assumed that sliceName and actionNames are also defined
  if (stageName) return level3Handler({ sliceName, actionName, stageName, dispatch })

  if (actionName) return level2Handler({ sliceName, actionName, dispatch })

  return new Proxy({ sliceName, dispatch }, level1Handler)
}

const getActions = (params) => {
  // Params can be slice or a pattern
  // params => slice
  // params => pathString => user:authentication, products:get:request

  return _getActions(params)
}

export { _getActions }
export default getActions
