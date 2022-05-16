import { useDispatch } from 'react-redux'
import { getCache } from '../helpers/cache'
import { CACHE_NAMESPACES } from '../helpers/const'
import actionsProxyHandler from './actionCreatorProxyHandler'

function useActions({ name }) {
  const slice = getCache(CACHE_NAMESPACES.STATE_SERVICE_RAW_SLICES, name)
  const dispatch = useDispatch()
  return new Proxy({ slice, dispatch }, actionsProxyHandler)
}

export default useActions
