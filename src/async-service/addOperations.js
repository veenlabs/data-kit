import { get } from '../helpers/lodash'
import { ASYNC_SERVICE_DEFAULT_PROVIDER_NAME, CACHE_NAMESPACES } from '../helpers/const'
import { setCache, getCache } from '../helpers/cache'

function addOperations(options) {
  const { _config, ...operations } = options
  const providerName = get(_config, 'name', ASYNC_SERVICE_DEFAULT_PROVIDER_NAME)
  const optionsToSave = { ...getCache(CACHE_NAMESPACES.ASYNC_SERVICE_OPERATIONS_OPTIONS, providerName, {}), providerName }
  setCache(CACHE_NAMESPACES.ASYNC_SERVICE_OPERATIONS_OPTIONS, providerName, optionsToSave)
}

export default addOperations
