import React from 'react'
import { useActions, useStateService, getActions } from '@veenlabs/data-kit/state-service'

function Login() {
  const userReady = useStateService('user:getIsSet')
  const fullName = useStateService('user:getFullName')
  const { authenticate } = useActions('user')
  const { get: getProducts } = useActions('products')

  const click2 = () => {
    const actions = getActions('user')
    console.log('user:authenticate:request-->', actions.authenticate({ a: 1, b: 2, c: 3 }))
    console.log('user:authenticate:success-->', actions.authenticate({ a: 1, b: 2, c: 3 }, 'success'))
    console.log('user:authenticate:failure-->', actions.authenticate({ a: 1, b: 2, c: 3 }, 'failure'))
  }

  if (userReady) {
    return <div>Hello {fullName}</div>
  }
  return (
    <>
      <button onClick={() => authenticate({ user: 'zpraveen' })}>Login</button> <br />
      <button onClick={click2}>click2</button> <br />
      <button onClick={getProducts}>get Products</button> <br />
    </>
  )
}

export default Login
