import { getCache } from '../helpers/cache'
import { CACHE_NAMESPACES } from '../helpers/const'
import { get } from '../helpers/lodash'

function getProviderConfig(name) {
  return getCache(CACHE_NAMESPACES.ASYNC_SERVICE_CONFIG, name, null)
}

function getOperations(providerName) {
  return getCache(CACHE_NAMESPACES.ASYNC_SERVICE_OPERATIONS_OPTIONS, providerName, null)
}

function getOperationOptions(providerName, operationName) {
  const operations = getOperations(providerName)
  return get(operations, [operationName], null)
}

export { getProviderConfig, getOperationOptions }
