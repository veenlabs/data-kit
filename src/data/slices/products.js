import { createSlice } from '@veenlabs/data-kit/state-service'

const slice = createSlice({
  name: 'products',
  initialState: [],
  selectors: {},
  get: {
    request: {
      reducer: (state) => {
        return state.concat(Date.now())
      },
      saga: function* () {},
      sagaEffect: 'takeLatest',
    },
    success: {
      reducer: () => {},
      saga: function* () {},
      sagaEffect: 'takeLatest',
    },
  },
  someThingElse: {
    reducer: () => {},
    saga: function* () {},
    sagaEffect: 'takeLatest',
  },
})

export default slice
