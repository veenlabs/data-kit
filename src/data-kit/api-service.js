const config = () => {}
const extend = () => {}
const useApiStatus = () => {}

const apiServiceHandler = {
  get(target, prop, receiver) {
    return function () {
      return new Promise((resolve) => {
        setTimeout(function () {
          resolve('Hello from promise')
        }, 30)
      })
    }
  },
}

const apiService = new Proxy({}, apiServiceHandler)

export { config, extend, useApiStatus, apiService }
