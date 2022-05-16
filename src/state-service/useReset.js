import { STATE_SERVICE_RESET_ACTION } from '../helpers/const'

function useReset() {
  const dispatch = useDispatch()
  dispatch({
    type: STATE_SERVICE_RESET_ACTION,
  })
}

export default useReset
