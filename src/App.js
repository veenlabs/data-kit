import React from 'react'
import { Provider, useSelector } from 'react-redux'
import store from './data/store'
import Login from './components/login'

const Component = () => {
  const data = useSelector((s) => s)
  console.log(data)
  return <div>Component</div>
}

function App() {
  return (
    <Provider store={store}>
      <Component />
      <Login />
    </Provider>
  )
}

export default App
