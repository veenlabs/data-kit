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
  } else if (options.length > 0) {
    url = options[0]
    method = options[1]
  } else {
    method = options.method
    url = options.url
  }

  let finalOptions = {
    url: provider.baseUrl + url,
    headers: provider.commonHeaders,
    method,
    data: data,
  }

  return finalOptions
}

export { formatApiOperation }
