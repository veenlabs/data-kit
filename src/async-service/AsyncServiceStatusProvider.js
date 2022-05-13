import produce from 'immer'
import React, { useState } from 'react'
import { ASYNC_SERVICE_OPERATION_STATUS_CHANGE_EVENT } from '../helpers/const'
import { subscribe, unSubscribe } from './events'

const AsyncServiceContext = React.createContext()

// status is stored at this key
const produceStatusKey = (providerName, operationName) => `${providerName}::${operationName}`

const AsyncServiceProvider = ({ children }) => {
  const [status, setStatus] = useState({})
  React.useEffect(() => {
    subscribe(ASYNC_SERVICE_OPERATION_STATUS_CHANGE_EVENT, 'ApiStatusProvider_fn', (event) => {
      setStatus((s) => {
        const { providerName, operationName, status } = event
        const key = produceStatusKey(providerName, operationName)
        return produce(s, (draft) => {
          draft[key] = status
        })
      })
    })
    return () => {
      unSubscribe(ASYNC_SERVICE_OPERATION_STATUS_CHANGE_EVENT, 'ApiStatusProvider_fn')
    }
  }, [status])
  return <AsyncServiceContext.Provider value={{ status }}>{children}</AsyncServiceContext.Provider>
}

export { AsyncServiceContext, produceStatusKey }
export default AsyncServiceProvider
