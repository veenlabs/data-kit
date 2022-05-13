// <action>
let action = {
  type: 'add', //<type>
  payload: '',
}

const slice = createSlice({
  name: 'sliceName', //<sliceName>
  initialState: [],
  selectors: {
    getUsers: (state) => state.map((s) => s.fullName),
  },
  actions: {
    getSomething: {}, //{} => handler
    addSomething: {}, //addSomething = <actionName>
    updateUser: {
      request: {
        reducer: () => {},
        saga: () => {},
      },
      success: {},
      failure: {},
      // Each key is a step
      // value is handler
    },
  },
})
