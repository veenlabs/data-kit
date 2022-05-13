import { getCache, NAMESPACES } from '../helpers/cache'
import { ASYNC_SERVICE_DEFAULT_PROVIDER_NAME, CACHE_NAMESPACES } from '../helpers/const'

function getProviderConfig(name) {
  return getCache(CACHE_NAMESPACES.ASYNC_SERVICE_CONFIG, name, null)
}

export { getProviderConfig }
