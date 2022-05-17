import React from 'react'
import { AsyncService } from '@veen/data-kit'
import { Provider } from 'react-redux'

import './data/apiSetup'
import store from './data/store'

import ApiCallSample from './components/ApiCallSample'
import AuthDemo from './components/AuthDemo'
import CoursesDemo from './components/CoursesDemo'
import Invalids from './components/Invalids'
import MoreWaysToAccess from './components/MoreWaysToAccess'

const { AsyncServiceStatusProvider } = AsyncService

const Main = () => {
  return (
    <Provider store={store}>
      <AsyncServiceStatusProvider>
        <MoreWaysToAccess />
        <AuthDemo />
        {/* <Invalids /> */}
        <CoursesDemo />
        <ApiCallSample />
      </AsyncServiceStatusProvider>
    </Provider>
  )
}

function App() {
  return <Main />
}

export default App
