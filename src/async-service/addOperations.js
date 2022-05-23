import { get } from '../helpers/lodash'
import { ASYNC_SERVICE_DEFAULT_PROVIDER_NAME, ASYNC_SERVICE_DEFAULT_MODULE_NAME, CACHE_NAMESPACES } from '../helpers/const'
import { setCache, getCache, getCacheWithProduceFn } from '../helpers/cache'

function addOperations(options) {
  const { _config, ...operations } = options
  const providerName = get(_config, 'providerName', ASYNC_SERVICE_DEFAULT_PROVIDER_NAME)
  const moduleName = get(_config, 'moduleName', ASYNC_SERVICE_DEFAULT_MODULE_NAME)

  const existingOperations = getCache(CACHE_NAMESPACES.ASYNC_SERVICE_OPERATIONS_OPTIONS, [providerName, moduleName], {})
  const newOperations = { ...existingOperations, ...operations }
  setCache(CACHE_NAMESPACES.ASYNC_SERVICE_OPERATIONS_OPTIONS, [providerName, moduleName], newOperations)
}

export default addOperations
