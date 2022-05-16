import { useDispatch } from 'react-redux'

// const _useActionsProxyHandler = {
//     get(target, actionName, receiver) {
//       return (payload, step) => {
//         const { sliceName, dispatch } = target
//         const actions = getActions(sliceName)
//         const action = actions[actionName]
//         dispatch(action(payload, step))
//       }
//     },
//   }

// const useActions = (sliceName) => {
//     const dispatch = useDispatch()
//     let value = getCacheValue('useActions', sliceName)
//     if (!value) {
//       value = new Proxy({ sliceName, dispatch }, _useActionsProxyHandler)
//       setCacheValue('useActions', sliceName, value)
//     }
//     return value
//   }

function useActions() {
  const dispatch = useDispatch()
  return (props) => ({
    action1: () => dispatch(action()),
  })
}

export default useActions
