import { config } from '@veenlabs/data-kit/api-service'

// Add config base
config({
  // optional, if not passed it will always be base
  serverName: 'base',
  baseUrl: 'http://localhost:8088',
  commonHeaders: {
    'x-client-id': '1', //@todo
    'x-request-id': 'nanoid()',
  },
  beforeRequest: (options) => {
    options.method = 'get'
    options.url = 'http://localhost:8088/api/v1/courses/'
    return options
  },
  beforeSuccess: (result) => {
    // this will be called just before returning result from success
    // return response.data
    return result.data
  },
})

config({
  // optional, if not passed it will always be base
  serverName: 'server2',
  baseUrl: 'http://dev.api.veenreader.com',
  commonHeaders: {
    'x-client-id': '1', //@todo
    'x-request-id': 'nanoid()',
  },
  beforeRequest: (options) => {},
  beforeSuccess: (response) => {
    // this will be called just before returning result from success
    // return response.data
  },
})
