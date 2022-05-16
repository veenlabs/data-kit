import { getActionTypeFromPath, handlerHasSteps } from './utils'

const handlerHasStepsByActionName = (actionName, slice) => {
  const handler = slice['actions'][actionName]
  return handlerHasSteps(handler)
}

const handler = {
  get({ slice, dispatch }, actionName, receiver) {
    const hasSteps = handlerHasStepsByActionName(actionName, slice)
    let path = [slice.name, actionName]
    const actionCreator = (data) => {
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
              path.push(prop)
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

export default handler
