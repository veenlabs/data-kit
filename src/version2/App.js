import React from 'react'
import { AsyncService } from '@veen/data-kit'
import { Provider } from 'react-redux'

import './data/apiSetup'
import store from './data/store'

import ApiCallSample from './components/ApiCallSample'

const { AsyncServiceStatusProvider } = AsyncService

const Main = () => {
  return (
    // <Provider store={store}>
    <AsyncServiceStatusProvider>
      <ApiCallSample />
    </AsyncServiceStatusProvider>
    // </Provider>
  )
}

function App() {
  return <Main />
}

export default App
