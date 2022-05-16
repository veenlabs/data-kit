import React from 'react'
import { AsyncService, StateService } from '@veen/data-kit'
import './data/apiSetup'

import NewLogin from './components/new-login'

const { AsyncServiceStatusProvider } = AsyncService

const Main = () => {
  return (
    <AsyncServiceStatusProvider>
      <NewLogin />
    </AsyncServiceStatusProvider>
  )
}

function App() {
  return <Main />
}

export default App
