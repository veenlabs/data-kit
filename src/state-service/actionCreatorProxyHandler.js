import { getActionTypeFromPath, handlerHasSteps, isObjectReactSyntheticEvent, isHandlerAPIRequest, isHandlerComplexAPIRequest } from './utils'
import { get } from '../helpers/lodash'

const handlerHasStepsByActionName = (actionName, slice) => {
  const handler = slice['actions'][actionName]
  return handlerHasSteps(handler)
}

const proxyHandler = {
  get({ slice, dispatch }, actionName, receiver) {
    const handler = get(slice, ['actions', actionName])

    if (!handler) {
      return () => {
        console.warn("Invalid Action: this action doesn't exist in slice", { slice: get(slice, 'name'), actionName })
      }
    }

    // steps now or in future
    const hasSteps = handlerHasStepsByActionName(actionName, slice) || isHandlerAPIRequest(handler) || isHandlerComplexAPIRequest(handler)
    const actionCreator = (data) => {
      let path = [slice.name, actionName]
      // ignore  react events
      if (isObjectReactSyntheticEvent(data)) {
        data = null
      }
      if (hasSteps) {
        path.push('request')
      }
      const action = { type: getActionTypeFromPath(path), payload: data }
      dispatch && dispatch(action)
      return action
    }
    if (hasSteps) {
      const proxy = new Proxy(
        { request: 1, success: 1, failure: 1 },
        {
          get(target, prop) {
            return (data) => {
              let path = [slice.name, actionName, prop]
              const action = { type: getActionTypeFromPath(path), payload: data }
              dispatch && dispatch(action)
              return action
            }
          },
        },
      )
      Object.assign(actionCreator, proxy)
    }
    return actionCreator
  },
}

export default proxyHandler
