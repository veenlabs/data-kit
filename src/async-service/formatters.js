import { get } from '../helpers/lodash'
function formatApiOperation(options, provider, data) {
  /**
   * options points to raw property set by user. Below are some examples
   * {
   *  getUser:'/api/v1/users',
   *  getUser:['/api/v1/users','post'],
   *  getUser:{
   * *  method:'post',
   * *  url:'/api/v1/users'
   *  },
   * }
   */
  let method = 'get'
  let url = ''

  if (typeof options === 'string') {
    url = options
  } else if (typeof options === 'function') {
    url = options(data)
  } else if (options.length > 0) {
    url = options[0]
    if (typeof options[0] === 'function') {
      url = options[0](data)
    }
    method = options[1]
  } else {
    method = options.method
    url = options.url
  }

  const requestData = get(data, 'body', data)
  let finalOptions = {
    url: provider.baseUrl + url,
    method,
    data: requestData,
  }

  return finalOptions
}

export { formatApiOperation }
