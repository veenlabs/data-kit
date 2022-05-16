import { createSlice, getActions } from '@veenlabs/data-kit/state-service'
import { call, put, takeEvery } from 'redux-saga/effects'
import { apiService, addApis } from '@veenlabs/data-kit/api-service'

// Apis
addApis({
  getCourses: '/api/v1/courses/',
})

const slice = createSlice({
  name: 'courses',
  initialState: [],
  selectors: {
    courseList: (state) => state.map((s) => s.fullName),
  },
  getCourses: apiService.getCourses,
  getCourses2: {
    request: {
      saga: function* () {
        const result = yield call(apiService.getCourses)
        yield put(getActions('courses').getCourses2(result, 'success'))
      },
      extraOptions: { getCourses2: 'request' },
    },
    success: {
      reducer: (actions, { payload }) => {
        // return { getCourses2: payload }
        return payload
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
  getCourses4: [apiService.getCourses, takeEvery],
  getCourses5: {
    api: apiService.getCourses,
    extraOptions: { a: 1, b: 2, ceeeed: 3 },
  },
})

export default slice
