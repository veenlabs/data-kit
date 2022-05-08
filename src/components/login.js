import React from 'react'
import { useActions, useStateService, getActions } from '@veenlabs/data-kit/state-service'
import { apiService } from '@veenlabs/data-kit/api-service'

function Login() {
  const userReady = useStateService('user:getIsSet')
  const fullName = useStateService('user:getFullName')
  const { authenticate } = useActions('user')
  const { get: getProducts, someThingElse } = useActions('products')

  const click2 = () => {
    const actions = getActions('user')
    console.log('user:authenticate:request-->', actions.authenticate({ a: 1, b: 2, c: 3 }))
    console.log('user:authenticate:success-->', actions.authenticate({ a: 1, b: 2, c: 3 }, 'success'))
    console.log('user:authenticate:failure-->', actions.authenticate({ a: 1, b: 2, c: 3 }, 'failure'))
  }

  const handleApiService = async () => {
    // const result1 = await apiService.updateUser()
    const result4 = await apiService.createUser() //()
    // const result2 = apiService.getMe//()
    // const result3 = apiService.server2.getMe//()
    // console.log({result1, result2})
    console.log(result4)
  }

  if (userReady) {
    return <div>Hello {fullName}</div>
  }
  return (
    <>
      <button onClick={() => authenticate({ user: 'zpraveen' })}>Login</button> <br />
      <button onClick={click2}>click2</button> <br />
      <button onClick={getProducts}>get Products</button> <br />
      <button onClick={someThingElse}>Product:Something else</button> <br />
      <button onClick={handleApiService}>apiService.getMe</button> <br />
    </>
  )
}

export default Login
