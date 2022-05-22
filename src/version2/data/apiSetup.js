import { AsyncService } from '@veen2/data-kit'

const { addConfiguration, addOperations, types, useAsyncServiceStatus } = AsyncService

addConfiguration({
  baseUrl: 'http://localhost:8088',
  commonHeaders: {
    'x-client-id': '1', //@todo
    'x-request-id': 'nanoid()',
  },
  type: types.webType,
  beforeSuccess: (response) => {
    return response.data
  },
})

addOperations({
  getCourses: '/api/v1/courses/',
  getCourses2: ['/api/v1/courses/'],
  getCourses3: ['/api/v1/courses/', 'post'],
  getCourses4: {
    url: '/api/v1/courses/',
    beforeSuccess: (parentFn, response) => {
      return parentFn(response).data
    },
  },
  authenticate1: '/api/v1/users/authenticate',
  authenticate2: ['/api/v1/users/authenticate', 'post'],
  getUser: '/api/v1/users/me',
})
