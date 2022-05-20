import { useSelector } from 'react-redux'
import getSliceSelectors from './getSliceSelectors'

function useSliceSelector(params) {
  const selectorPath = typeof params === 'string' ? params : params.name
  const [sliceName, selectorName] = selectorPath.split(':')
  const selectors = getSliceSelectors(selectorPath)
  if (selectorName) {
    const result = useSelector(selectors)
    return result
  } else {
    return new Proxy(selectors, {
      get(selectorsInner, prop) {
        const result = useSelector(selectorsInner[prop])
        return result
      },
    })
  }
}

export default useSliceSelector
