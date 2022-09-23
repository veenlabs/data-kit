import axios from 'axios'
import { getCacheWithProduceFn } from '../helpers/cache'
import {
  ASYNC_SERVICE_API_ERROR_NAME,
  ASYNC_SERVICE_DEFAULT_MODULE_NAME,
  ASYNC_SERVICE_DEFAULT_PROVIDER_NAME,
  ASYNC_SERVICE_HANDLER_TYPE,
  ASYNC_SERVICE_PROVIDER_WEB_API_TYPE,
  ASYNC_SERVICE_STATUSES,
  CACHE_NAMESPACES,
} from '../helpers/const'
import { getOperationOptions, getProviderConfig } from './utils'
import { get } from '../helpers/lodash'
import { setOperationStatus } from './operationStatus'
import { formatApiOperation } from './formatters'

const _identity = (v) => v
const _chain = (par, v) => par(v)
const _identity3 = async (v) => v

// @todo: USe moduleName
const getBeforeRequestBeforeSuccess = (operationOptions, moduleName, provider) => {
  const beforeRequestPar = get(provider, 'beforeRequest', _identity)
  const beforeRequestCh = get(operationOptions, 'beforeRequest', _chain)

  const beforeSuccessPar = get(provider, 'beforeSuccess', _identity)
  const beforeSuccessCh = get(operationOptions, 'beforeSuccess', _chain)

  const beforeRequest = async (options) => {
    return await beforeRequestCh(beforeRequestPar, options)
  }
  const beforeSuccess = async (data) => {
    return await beforeSuccessCh(beforeSuccessPar, data)
  }

  return { beforeRequest, beforeSuccess }
}

async function makeRequest({ providerName, moduleName, operationName, data }) {
  const provider = getProviderConfig(providerName)
  const providerType = get(provider, ['type'])
  const options = getOperationOptions(providerName, moduleName, operationName)
  let formatOperation = get(provider, ['formatOperation'])
  let runAsyncOperation = get(provider, ['runAsyncOperation'])
  const { beforeRequest, beforeSuccess } = getBeforeRequestBeforeSuccess(options, moduleName, provider)

  formatOperation = !!formatOperation ? formatOperation : providerType == ASYNC_SERVICE_PROVIDER_WEB_API_TYPE ? formatApiOperation : _identity
  runAsyncOperation = !!runAsyncOperation ? runAsyncOperation : providerType == ASYNC_SERVICE_PROVIDER_WEB_API_TYPE ? axios : _identity3

  let requestOptions = formatOperation(options, provider, data)
  requestOptions = await beforeRequest(requestOptions, data)

  setOperationStatus(providerName, moduleName, operationName, ASYNC_SERVICE_STATUSES.REQUEST)
  try {
    const result = await runAsyncOperation(requestOptions)
    setOperationStatus(providerName, moduleName, operationName, ASYNC_SERVICE_STATUSES.SUCCESS)
    const result2 = await beforeSuccess(result)
    return result2
  } catch (error) {
    error.name = ASYNC_SERVICE_API_ERROR_NAME
    setOperationStatus(providerName, moduleName, operationName, ASYNC_SERVICE_STATUSES.FAILURE)
    throw error
  }
}

const asyncServiceHandler = {
  get({ providerName = ASYNC_SERVICE_DEFAULT_PROVIDER_NAME }, prop) {
    if (prop === '__type') {
      return ASYNC_SERVICE_HANDLER_TYPE
    }
    const fn = (data) => {
      return makeRequest({ providerName, moduleName: ASYNC_SERVICE_DEFAULT_MODULE_NAME, operationName: prop, data })
    }
    return new Proxy(fn, {
      get(t, operationName) {
        if (operationName === '__type') {
          return ASYNC_SERVICE_HANDLER_TYPE
        }
        const fn2 = (data) => {
          return makeRequest({ providerName, moduleName: prop, operationName: operationName, data })
        }
        fn2.__type = ASYNC_SERVICE_HANDLER_TYPE
        return fn2
      },
    })
  },
}
const getAsyncProxy = (providerName) => {
  return getCacheWithProduceFn(CACHE_NAMESPACES.ASYNC_SERVICE_ASYNC_HANDLER_PROXY, providerName, () => {
    return new Proxy({ providerName }, asyncServiceHandler)
  })
}
let asyncServiceInner = (providerName) => getAsyncProxy(providerName)
let asyncService = new Proxy(asyncServiceInner, asyncServiceHandler)

export default asyncService
