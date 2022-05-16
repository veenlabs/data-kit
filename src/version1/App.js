import React from 'react'
import { Provider, useSelector } from 'react-redux'

import './data/apiSetup'
import store from './data/store'
import Login from './components/login'
import { ApiStatusProvider } from '../data-kit/api-service'

const Main = () => {
  return (
    <div>
      <Login />
    </div>
  )
}

function App() {
  return (
    <Provider store={store}>
      <ApiStatusProvider>
        <Main />
      </ApiStatusProvider>
    </Provider>
  )
}

export default App
