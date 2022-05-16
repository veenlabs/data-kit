import React from 'react'

import { AsyncService } from '@veen/data-kit'

const { addConfiguration, addOperations, asyncService, types, useAsyncServiceStatus } = AsyncService

addConfiguration({
  // name: 'n2',
  baseUrl: 'http://localhost:8088',
  commonHeaders: {
    'x-client-id': '1', //@todo
    'x-request-id': 'nanoid()',
  },
  type: types.webType,
  // beforeRequest: (options) => {
  //   options.method = 'get'
  //   options.url = 'http://localhost:8088/api/v1/courses/'
  //   return options
  // },
  // beforeSuccess: (result) => {
  //   // this will be called just before returning result from success
  //   // return response.data
  //   return result.data
  // },
})
addOperations({
  getCourses: {
    url: '/api/v1/courses/',
    beforeSuccess: (para, response) => {
      return response.data.data
    },
  },
})

addConfiguration({
  name: 'n1',
  url: 'http://google.com',
  runAsyncOperation: async (options) => {
    return { success: options }
  },
  formatOperation: (options, provider) => {
    return { ...options, extra: 1 }
  },
})

addOperations({
  _config: {
    providerName: 'n1',
  },
  add: { url: 'add', name: 'praveen' },
  remove: { url: 'remove', name: 'praveen' },
})
addOperations({
  _config: {
    providerName: 'n1',
  },
  update: { url: 'update', name: 'praveen' },
  read: { url: 'read', name: 'praveen' },
})

function NewLogin() {
  const status = useAsyncServiceStatus('getCourses')
  const action1 = async () => {
    let res = await asyncService.n1.add()
    let res2 = await asyncService.n1.remove()
    let res3 = await asyncService.n1.update()
    let res4 = await asyncService.n1.read()

    let courses = await asyncService.getCourses()

    console.log({ res, res2, res3, res4, courses })
  }
  const action2 = async () => {
    let courses = await asyncService.getCourses()
    console.log(courses)
  }
  return (
    <div>
      <h1>status: {status}</h1>
      <button onClick={action1}>All requests</button> <br />
      <button onClick={action2}>Get courses</button>
    </div>
  )
}

export default NewLogin
