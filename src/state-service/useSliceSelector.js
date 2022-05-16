import { useSelector } from 'react-redux'
import { getCache } from '../helpers/cache'
import { CACHE_NAMESPACES } from '../helpers/const'
import { get, identity } from '../helpers/lodash'

function useSliceSelector(sliceRef) {
  const selector = (s) => {
    return new Proxy(
      {},
      {
        get(target, prop) {
          const slice = getCache(CACHE_NAMESPACES.STATE_SERVICE_RAW_SLICES, sliceRef.name)
          const path = ['selectors', prop]
          const currentSelector = get(slice, path, null)
          try {
            return currentSelector(s[slice.name], s)
          } catch (error) {
            console.warn('Error thrown from selector', path)
            console.warn(error)
          }
        },
      },
    )
  }
  const result = useSelector(selector)
  return result
}

function useSliceSelector2(selectorPath = '') {
  // selectorPath = sliceName:selector -> user:getFullName
  const [sliceName, selectorName] = selectorPath.split(':')
  const selector = (s) => {
    const slice = getCache(CACHE_NAMESPACES.STATE_SERVICE_RAW_SLICES, sliceName)
    const path = ['selectors', selectorName]
    const currentSelector = get(slice, path, null)
    try {
      return currentSelector(s[slice.name], s)
    } catch (error) {
      console.warn('Error thrown from selector', path)
      console.warn(error)
    }
  }
  const result = useSelector(selector)
  return result
}

export { useSliceSelector2 }

export default useSliceSelector
