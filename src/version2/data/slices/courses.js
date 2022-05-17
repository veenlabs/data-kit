import { StateService, AsyncService } from '@veen/data-kit'
const { asyncService } = AsyncService
const { createSlice } = StateService

const slice = createSlice({
  name: 'courses',
  // actions:asyncService.getCourses
})

export default slice
