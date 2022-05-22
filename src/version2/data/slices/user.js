import { StateService, AsyncService } from '@veen2/data-kit'
import { get } from 'lodash'
import { call, put } from 'redux-saga/effects'
const { asyncService } = AsyncService
const { createSlice } = StateService

const slice = createSlice({
  name: 'user',
  initialState: '',
  selectors: {
    getUserName: (s, fullState) => get(s, 'data.user.fullName', 'Not available'),
    getEmail: (s, fullState) => get(s, 'data.user.email', 'Not available'),
  },
  actions: {
    authenticate1: asyncService.authenticate1,
    authenticate2: asyncService.authenticate2,
    authenticate3: {
      request: {
        saga: function* ({ payload }) {
          const result = yield call(asyncService.authenticate2, payload)
          yield put(slice.actions.authenticate3.success(result))
        },
        extraOptions: { a: 1 },
      },
      success: {
        reducer: (state, { payload }) => {
          return payload
        },
      },
    },
    logout: {
      saga: function* () {
        console.log('logout:saga')
        // yield call()
      },
      reducer: () => {},
    },
    modifyName: {
      reducer: (state) => {
        state.data.user.email = 'Helloooooooooo'
      },
    },
    getUser: asyncService.getUser,
  },
})

export default slice
