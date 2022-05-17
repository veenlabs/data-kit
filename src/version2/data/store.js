import { StateService } from '@veen/data-kit'
import userSlice from './slices/user'
import courseSlice from './slices/courses'

const { configureStore, setup } = StateService

setup({
  // loggingEnabled: false,
  beforeHandleSaga: function* (action, extraOptions) {
    console.log({ action, extraOptions })
    console.log('Saga starts....')
  },
  afterSuccessHandleSaga: function* () {
    console.log('Saga end....')
  },
})

const store = configureStore(userSlice, courseSlice)

export default store
