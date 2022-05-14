import { useContext } from 'react'
import { ASYNC_SERVICE_DEFAULT_PROVIDER_NAME } from '../helpers/const'
import { produceStatusKey, AsyncServiceContext } from './AsyncServiceStatusProvider'
import { get } from '../helpers/lodash'

const useOperationStatus = (operationName, providerName = ASYNC_SERVICE_DEFAULT_PROVIDER_NAME) => {
  const key = produceStatusKey(providerName, operationName)
  let contextData = useContext(AsyncServiceContext)
  return get(contextData, ['status', key], null)
}
export default useOperationStatus
