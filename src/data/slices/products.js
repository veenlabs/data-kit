import { createSlice, getActions } from '@veenlabs/data-kit/state-service'
import { put } from 'redux-saga/effects'

const slice = createSlice({
  name: 'products',
  initialState: [],
  selectors: {},
  get: {
    request: {
      reducer: (state) => {
        return state.concat(Date.now())
      },
      saga: function* () {
        console.log('product:get:request:saga')
        yield put(getActions('products').get(['shoes', 'bulbs'], 'success'))
      },
    },
    success: {
      reducer: (actions, { payload }) => {
        return payload
      },
      saga: function* () {
        console.log('product:success:request:saga')
      },
    },
  },
  someThingElse: {
    reducer: (state) => {
      // console.log('someThingElse.reducer')
      // return state
    },
    saga: function* () {
      console.log('product:someThingElse:saga')
    },
  },
})

export default slice
