import { useDispatch } from 'react-redux'
import { _getActions } from './getActions'

const useActions = (params) => {
  // Params can be slice or a pattern
  // params => slice
  // params => pathString => user:authentication, products:get:request

  const dispatch = useDispatch()
  return _getActions(params, dispatch)
}

export default useActions
