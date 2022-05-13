import { get } from './lodash'
import { ASYNC_SERVICE_DEFAULT_PROVIDER_NAME } from '../helpers/const'
import { setCache, getCache, NAMESPACES } from '../helpers/cache'

function addOperations(options) {
  const { _config, ...operations } = options
  const providerName = get(_config, 'name', ASYNC_SERVICE_DEFAULT_PROVIDER_NAME)
  const optionsToSave = { ...getCache(NAMESPACES.ASYNC_SERVICE_OPERATIONS_OPTIONS, providerName, {}), providerName }
  setCache(NAMESPACES.ASYNC_SERVICE_OPERATIONS_OPTIONS, providerName, optionsToSave)
}

export { addOperations }
