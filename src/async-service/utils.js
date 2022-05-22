import { getCache } from '../helpers/cache'
import { CACHE_NAMESPACES } from '../helpers/const'
import { get } from '../helpers/lodash'

function getProviderConfig(name) {
  return getCache(CACHE_NAMESPACES.ASYNC_SERVICE_CONFIG, name, null)
}

function getOperationOptions(providerName, moduleName, operationName) {
  return getCache(CACHE_NAMESPACES.ASYNC_SERVICE_OPERATIONS_OPTIONS, [providerName, moduleName, operationName], null)
}

export { getProviderConfig, getOperationOptions }
