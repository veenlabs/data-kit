import { StateService, AsyncService } from '@veen/data-kit'
const { asyncService } = AsyncService
const { createSlice } = StateService

const slice = createSlice({
  name: 'user',
  actions: {
    authenticate: [asyncService.authenticate, 'post'],
  },
})

export default slice
