import { setCache, NAMESPACES } from '../helpers/cache'
import { ASYNC_SERVICE_DEFAULT_PROVIDER_NAME } from '../helpers/const'

function addConfiguration(config) {
  setCache(NAMESPACES.ASYNC_SERVICE_CONFIG, config.name || ASYNC_SERVICE_DEFAULT_PROVIDER_NAME, config)
}

export default addConfiguration
