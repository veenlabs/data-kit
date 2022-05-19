import { useSelector } from 'react-redux'
import { getCache } from '../helpers/cache'
import { CACHE_NAMESPACES } from '../helpers/const'
import { get, identity } from '../helpers/lodash'

function runSelector(sliceName, selectorName, state) {
  const slice = getCache(CACHE_NAMESPACES.STATE_SERVICE_RAW_SLICES, sliceName)
  const path = ['selectors', selectorName]
  const currentSelector = get(slice, path, null)

  try {
    if (currentSelector) {
      return currentSelector(state[slice.name], state)
    } else {
      console.warn("Invalid selector: this selector doesn't exist in slice", { slice: get(slice, 'name'), selectorName })
      return `Invalid selector ${slice.name}.${selectorName}`
    }
  } catch (error) {
    console.warn('Error thrown from selector', path)
    console.warn(error)
  }
}

function useSliceSelector(sliceRef) {
  const selector = (s) => {
    return new Proxy(
      {},
      {
        get(target, selectorName) {
          return runSelector(sliceRef.name, selectorName, s)
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
  const selector = (s) => runSelector(sliceName, selectorName, s)
  const result = useSelector(selector)
  return result
}

export { useSliceSelector2 }

export default useSliceSelector
