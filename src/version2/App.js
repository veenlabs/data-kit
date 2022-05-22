import React from 'react'
import { AsyncService } from '@veen2/data-kit'
import { Provider } from 'react-redux'

import './data/apiSetup'
import store from './data/store'

import ApiCallSample from './components/ApiCallSample'
import AuthDemo from './components/AuthDemo'
import CoursesDemo from './components/CoursesDemo'
import Invalids from './components/Invalids'
import MoreWaysToAccess from './components/MoreWaysToAccess'
// import NewActions from './components/NewActions'
import NewActions3 from './components/NewActions3'
import SelectorSample from './components/SelectorSample'

const { AsyncServiceStatusProvider } = AsyncService

const Main = () => {
  return (
    <Provider store={store}>
      <AsyncServiceStatusProvider>
        <SelectorSample />
        <NewActions3 />
        <MoreWaysToAccess />
        <AuthDemo />
        <Invalids />
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
