import { config, configureStore } from '@veenlabs/data-kit/state-service'
import slice1 from './slices/user'
import slice2 from './slices/products'

const store = configureStore(slice1, slice2)

config({
  beforeHandleSaga: function* () {},
  afterHandleSaga: function* () {},
})

export default store
