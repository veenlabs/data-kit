import { AsyncService } from '@veen2/data-kit'

const { addConfiguration, addOperations, asyncService, types } = AsyncService

console.log(AsyncService)

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
  // _config: {
  //     providerName: 'n2'
  // },
  getCourses: '/api/v1/courses/',
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

async function main() {
  let res = await asyncService.n1.add()
  let res2 = await asyncService.n1.remove()
  let res3 = await asyncService.n1.update()
  let res4 = await asyncService.n1.read()

  let courses = await asyncService.getCourses()

  console.log({ res, res2, res3, res4, courses })
}

main()
