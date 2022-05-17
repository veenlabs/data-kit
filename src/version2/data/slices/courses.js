import { StateService, AsyncService } from '@veen/data-kit'
const { asyncService } = AsyncService
const { createSlice } = StateService

const slice = createSlice({
  name: 'courses',
  actions: {
    getCourses4: asyncService.getCourses4,
  },
})

export default slice