import { StateService, AsyncService } from '@veen2/data-kit'
const { asyncService } = AsyncService
const { createSlice } = StateService

const slice = createSlice({
  name: 'courses',
  actions: {
    getCourses4: asyncService.getCourses4,
    getCourses3: asyncService.getCourses3,
    getCourses4231: {
      request: asyncService.getCourses,
      success: {
        reducer: function () {
          console.log('---> reducer')
        },
        saga: function () {
          console.log('---> saga')
        },
      },
    },
    onlyReducerWithouStage: {
      reducer: () => {
        console.log('onlyReducerWithouStage')
      },
    },
    onlySagaWithouStage: {
      saga: function* () {
        console.log('onlySagaWithouStage')
      },
    },
  },
})

// console.log(slice.actions.getCourses4())
// getAction('sliceName:actionName:step')

export default slice
