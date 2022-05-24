import { useDispatch } from 'react-redux'
import { STATE_SERVICE_RESET_ACTION_STATE } from '../helpers/const'
import { isObjectReactSyntheticEvent } from './utils'

const createResetAction = (sliceName) => {
  return {
    type: STATE_SERVICE_RESET_ACTION_STATE,
    payload: typeof sliceName === 'string' ? sliceName : STATE_SERVICE_RESET_ACTION_STATE,
  }
}

const useReset = () => {
  /**
   * // This will reset whole redux
   * const { reset } = useReset()
   *
   * // This will reset a slice
   * const { reset } = useReset(sliceName)
   */
  const dispatch = useDispatch()
  return {
    reset: (sliceName) => {
      dispatch(createResetAction(sliceName))
    },
  }
}

export { createResetAction }

export default useReset
