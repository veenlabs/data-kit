import React from 'react'
import userSlice from '../data/slices/user'
import { StateService } from '@veen/data-kit'

const { useActions, useSliceSelector, useReset } = StateService

function AuthDemo() {
  const { authenticate1, authenticate2, authenticate3, logout, modifyName } = useActions(userSlice)
  const { getUserName: userName } = useSliceSelector(userSlice)
  const email = useSliceSelector('user:getEmail')
  const { reset } = useReset()
  return (
    <div>
      <h1>
        AuthDemo : {userName} : {email}
      </h1>
      <button onClick={authenticate1}>Auth1:GET:Fail</button>
      <button
        onClick={() => {
          authenticate2()
        }}>
        Auth2:no-credentials Fail
      </button>
      <button
        onClick={() => {
          authenticate2({
            password: '1qazxsw2',
            username: 'dev@notepadeducation.in',
          })
        }}>
        Auth2:Success
      </button>
      <button
        onClick={() => {
          authenticate3({
            password: '1qazxsw2',
            username: 'dev@notepadeducation.in',
          })
        }}>
        Auth3
      </button>
      <button
        onClick={() => {
          authenticate3({
            password: '1111',
            username: 'd123',
          })
        }}>
        Auth4: Invalid Cred
      </button>
      <button onClick={logout}>logout</button>
      <button onClick={reset}>reset | ALL</button>
      <button onClick={() => reset('user')}>reset | User</button>
      <button onClick={modifyName}>Modify Name</button>
    </div>
  )
}

export default AuthDemo
