import React from 'react'
import { Provider, useSelector } from 'react-redux'
import { ApiStatusProvider } from '@veenlabs/data-kit/api-service'

import './data/apiSetup'
import store from './data/store'
import Login from './components/login'
import NewLogin from '../version2/components/new-login'

import { AsyncService, StateService } from '@veen/data-kit'

console.log({StateService})

const { AsyncServiceStatusProvider } = AsyncService

const Main = () => {
  return (
    <div>
      <Login />
    </div>
  )
}

const Main2 = () => {
  return (
    <div>
      <NewLogin />
    </div>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AsyncServiceStatusProvider>
        <Main />
      </AsyncServiceStatusProvider>
    </Provider>
  )
}

export default App
