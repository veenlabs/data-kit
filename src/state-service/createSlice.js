const handlerHasSteps = (actionName, slice) => {
  const handler = slice['actions'][actionName]
  if (Object.keys(handler).some((k) => ['request', 'failure', 'success'].indexOf(k) > -1)) {
    return true
  } else if (handler.stepsInFuture) {
    return true
  }
  return false
}

const handler = {
  get({ slice, dispatch }, actionName, receiver) {
    const hasSteps = handlerHasSteps(actionName, slice)
    let path = [slice.name, actionName]
    const actionCreator = (data) => {
      if (hasSteps) {
        path.push('request')
      }
      const action = { type: path.join('::'), payload: data }
      dispatch && dispatch(action)
      return action
    }
    if (hasSteps) {
      const proxy = new Proxy(
        { request: 1, success: 1, failure: 1 },
        {
          get(target, prop) {
            return (data) => {
              path.push(prop)
              const action = { type: path.join('::'), payload: data }
              dispatch && dispatch(action)
              return action
            }
          },
        },
      )
      Object.assign(actionCreator, proxy)
    }
    return actionCreator
  },
}

function createSlice(slice) {
  const { name, initialState, selectors, actions } = slice

  return {
    actions: new Proxy({ slice }, handler),
    slice: slice,
    // selectors: {},
    // reducer : (state = initialState, action)=>{
    //     if (action.type === RESET_ACTION_TYPE) {
    //         return initialState
    //     } else{
    //         if(actionTypes[action.type]){
    //             return actionTypes[action.type]()
    //         }
    //     }
    // },
    // sagas:[]
  }
}

// const dispatch = (action)=>{
//     console.log('dispachingg.......', action)
// }

// const useActions = (slice)=>{
//     return new Proxy({slice, dispatch}, handler)
// }

// const {noSteps, autoSteps, withSteps} = useActions(slice.slice)
// console.log('--===-->',noSteps('1'))
// console.log('--===-->',autoSteps('2'))
// console.log('--===-->',withSteps('3'))

export default createSlice
