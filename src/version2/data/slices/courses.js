import { StateService, AsyncService } from '@veen/data-kit'
const { asyncService } = AsyncService
const { createSlice } = StateService

const slice = createSlice({
  name: 'courses',
  actions: {
    getCourses4: asyncService.getCourses4,
    justReducer: {
      reducer: () => {
        console.log('Reducer:justReducer')
      },
    },
  },
})

console.log(slice.actions.getCourses4())
// getAction('sliceName:actionName:step')

export default slice
