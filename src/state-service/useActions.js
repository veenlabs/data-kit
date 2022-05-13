import { useDispatch } from 'react-redux'
import { getCache } from '../helpers/cache'
import { CACHE_NAMESPACES } from '../helpers/const'
import actionsProxyHandler from './actionCreatorProxyHandler'
import { getActionTypeFromPath, isObjectReactSyntheticEvent } from './utils'

function useActions(params) {
  // Params can be slice or a pattern
  //params => slice
  //params => pathString => user:authentication, products:get:request

  const dispatch = useDispatch()
  const stringPattern = typeof params === 'string' ? params : params.name
  const [sliceName, actionName, step] = stringPattern.split(':')
  const slice = getCache(CACHE_NAMESPACES.STATE_SERVICE_RAW_SLICES, sliceName)
  if (step) {
    return (data) => {
      dispatch({
        type: getActionTypeFromPath([sliceName, actionName, step]),
        payload: isObjectReactSyntheticEvent(data) ? null : data,
      })
    }
  } else if (actionName) {
    return (data) => {
      const p = new Proxy({ slice, dispatch }, actionsProxyHandler)
      p[actionName](data)
    }
  } else {
    return new Proxy({ slice, dispatch }, actionsProxyHandler)
  }
}

export default useActions
