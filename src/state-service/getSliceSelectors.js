import { getCache } from '../helpers/cache'
import { CACHE_NAMESPACES } from '../helpers/const'
import { get } from '../helpers/lodash'

const invalidSelectorWarning = ({ sliceName, selectorName }) => {
  return () => {
    console.warn('Invalid selector', { sliceName, selectorName })
  }
}

const getSliceSelectors = (params = '') => {
  // params => string pattern only

  /**
   * const userSelectors = getSliceSelectors('user')
   * const userName = getSliceSelectors('user:fullName')
   */

  const [sliceName, selectorName] = params.split(':')
  const sliceSelectors = getCache(CACHE_NAMESPACES.STATE_SERVICE_SLICE_SELECTORS, sliceName)
  if (selectorName) {
    const selector = get(sliceSelectors, [selectorName], invalidSelectorWarning({ sliceName, selectorName }))
    return selector
  } else {
    return sliceSelectors
  }
}

export default getSliceSelectors
