import { createSlice, getActions } from '@veenlabs/data-kit/state-service'
import { call, put } from 'redux-saga/effects'
import { apiService, addApis } from '@veenlabs/data-kit/api-service'

// Apis
addApis({
  getCourses: '/api/v1/courses/',
})

const slice = createSlice({
  name: 'courses',
  initialState: [],
  selectors: {},
  getCourses: apiService.getCourses,
  getCourses2: {
    request: {
      saga: function* () {
        const result = yield call(apiService.getCourses)
        yield put(getActions('courses').getCourses2(result, 'success'))
      },
    },
    success: {
      reducer: (actions, { payload }) => {
        return { getCourses2: payload }
      },
    },
  },
  getCourses3: {
    request: apiService.getCourses,
    success: {
      reducer: (action, { payload }) => {
        return { getCourses3: payload }
      },
    },
  },
})

export default slice
