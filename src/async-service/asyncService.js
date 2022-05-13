import axios from 'axios'
import { getProviderConfig } from './utils'
import { ASYNC_SERVICE_DEFAULT_PROVIDER_NAME, CACHE_NAMESPACES, ASYNC_SERVICE_STATUSES, ASYNC_SERVICE_HANDLER_TYPE, ASYNC_SERVICE_PROVIDER_WEB_API_TYPE } from '../helpers/const'
import { getCacheWithProduceFn } from '../helpers/cache'
import { get } from '../helpers/lodash'
import { formatApiOperation } from './formatters'
import { setOperationStatus } from './operationStatus'

const _identity = (v) => v
const _identity2 = (par, v) => par(v)
const _identity3 = async (v) => v

const getBeforeRequestBeforeRequest = (requestOptions, provider) => {
  const beforeRequestPar = get(provider, 'beforeRequest', _identity)
  const beforeRequestCh = get(requestOptions, 'beforeRequest', _identity2)

  const beforeSuccessPar = get(provider, 'beforeSuccess', _identity)
  const beforeSuccessCh = get(requestOptions, 'beforeSuccess', _identity2)

  const beforeRequest = (options) => {
    return beforeRequestCh(beforeRequestPar, options)
  }
  const beforeSuccess = (data) => {
    return beforeSuccessCh(beforeSuccessPar, data)
  }

  return { beforeRequest, beforeSuccess }
}

const handler2 = {
  get(target, operationName, receiver) {
    const providerName = get(target, 'providerName', ASYNC_SERVICE_DEFAULT_PROVIDER_NAME)
    const provider = getProviderConfig(providerName)
    const providerType = get(provider, ['type'])
    const options = get(provider, [operationName])
    let formatOperation = get(provider, [' formatOperation'])
    let runAsyncOperation = get(provider, ['runAsyncOperation'])

    formatOperation = !!formatOperation ? formatOperation : providerType == ASYNC_SERVICE_PROVIDER_WEB_API_TYPE ? formatApiOperation : _identity
    runAsyncOperation = !!runAsyncOperation ? runAsyncOperation : providerType == ASYNC_SERVICE_PROVIDER_WEB_API_TYPE ? axios : _identity3

    const requestOptions = formatOperation(provider, options)
    const { beforeRequest, beforeSuccess } = getBeforeRequestBeforeRequest(requestOptions, provider)

    requestOptions = beforeRequest(requestOptions)

    return () => {
      const serviceRequestHandler = async () => {
        setOperationStatus(providerName, operationName, ASYNC_SERVICE_STATUSES.REQUEST)
        try {
          const result = await runAsyncOperation(requestOptions)
          setOperationStatus(providerName, operationName, ASYNC_SERVICE_STATUSES.SUCCESS)
          return beforeSuccess(result.data)
        } catch (error) {
          setOperationStatus(providerName, operationName, ASYNC_SERVICE_STATUSES.FAILURE)
          throw error
        }
      }
      serviceRequestHandler.__type = ASYNC_SERVICE_HANDLER_TYPE
      return serviceRequestHandler
    }
  },
}

const proxy2 = new Proxy({}, handler2)

const asynServiceHandler = {
  get(target, prop, receiver) {
    const isProvider = !!getProviderConfig(prop)
    if (isProvider) {
      return getCacheWithProduceFn(CACHE_NAMESPACES.ASYNC_SERVICE_HANDLER_PROXY_1, prop, () => {
        return new Proxy({ providerName: prop }, handler2)
      })
    } else {
      try {
        return proxy2[prop]()
      } catch (error) {}
    }
  },
}

const asyncService = new Proxy({}, asynServiceHandler)

export default asyncService
