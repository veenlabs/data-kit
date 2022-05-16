import { setup, configureStore } from '@veenlabs/data-kit/state-service'
import slice1 from './slices/user'
import slice2 from './slices/products'
import slice3 from './slices/course'

const updateStatus = (message) => {
  document.getElementById('status-bar').innerHTML = message
}

// step 1
setup({
  beforeHandleSaga: function* (request, extraOptions) {
    updateStatus('Loading....')
    console.log('beforeHandleSaga', { request }, { extraOptions })
  },
  afterSuccessHandleSaga: function* () {
    updateStatus('Success....')
    console.log('afterSuccessHandleSaga')
  },
  afterFailHandleSaga: function* () {
    updateStatus('Error....')
    console.log('afterFailHandleSaga')
  },
})

// step 2
const store = configureStore(slice1, slice2, slice3)

export default store
