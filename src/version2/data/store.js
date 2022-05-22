import { StateService } from '@veen/data-kit'
import userSlice from './slices/user'
import courseSlice from './slices/courses'
import productsSlice from './slices/products'

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

const store = configureStore(userSlice, courseSlice, productsSlice)

export default store
