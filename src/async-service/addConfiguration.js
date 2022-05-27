import { setCache } from '../helpers/cache'
import { ASYNC_SERVICE_DEFAULT_PROVIDER_NAME, CACHE_NAMESPACES } from '../helpers/const'

/**
 * beforeRequest: (options, data)=>{}
 * beforeSuccess: (response)=>{}
 *
 */

function addConfiguration(config) {
  setCache(CACHE_NAMESPACES.ASYNC_SERVICE_CONFIG, config.name || ASYNC_SERVICE_DEFAULT_PROVIDER_NAME, config)
}

export default addConfiguration
