import React from 'react'
import { useActions, useStateSelector, getActions, useReset } from '@veenlabs/data-kit/state-service'
import { apiService, useApiStatus } from '@veenlabs/data-kit/api-service'
import CourseList from './CourseList'

function Login() {
  const { reset } = useReset()
  const userReady = useStateSelector('user:getIsSet')
  const fullName = useStateSelector('user:getFullName')
  const { authenticate, logout } = useActions('user')
  const { get: getProducts, someThingElse } = useActions('products')
  const { getCourses, getCourses2, getCourses3, getCourses4, getCourses5 } = useActions('courses')
  const status = useApiStatus('getCourses', 'base')

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

  const getCoursesHandle = () => {
    // getCourses()
    // getCourses2()
    // getCourses3()
    // getCourses4()
    getCourses5()
    // logout()
  }

  return (
    <>
      <h1>Status :{status}</h1>
      <h1 style={{ color: 'red' }}>
        <div>Full Name: {fullName} </div>
        <div>Logged in: {userReady ? 'YES' : 'NO'}</div>
      </h1>
      <button onClick={() => authenticate({ user: window.username || 'zpraveen' })}>Login</button> <br />
      <button onClick={click2}>click2</button> <br />
      <button onClick={getProducts}>get Products</button> <br />
      <button onClick={someThingElse}>Product:Something else</button> <br />
      <button onClick={handleApiService}>apiService.getMe</button> <br />
      <button onClick={getCoursesHandle}>Get courses</button> <br />
      <button onClick={reset}>Reset</button> <br />
      <CourseList />
      <div
        id="status-bar"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#005b80',
          color: '#fff',
        }}></div>
    </>
  )
}

export default Login
