import { useSelector } from 'react-redux'

function useStateSelector(selector) {
  const result = useSelector(selector)
  return result
}

export default useStateSelector
