import { CACHE_NAMESPACES, ASYNC_SERVICE_OPERATION_STATUS_CHANGE_EVENT } from '../helpers/const'
import { setCache } from '../helpers/cache'
import { emit } from './events'

const setOperationStatus = (providerName, moduleName, operationName, status) => {
  setCache(CACHE_NAMESPACES.ASYNC_SERVICE_OPERATION_STATUS, [providerName, moduleName, operationName], status)
  emit(ASYNC_SERVICE_OPERATION_STATUS_CHANGE_EVENT, { providerName, operationName, moduleName, status })
}

export { setOperationStatus }
