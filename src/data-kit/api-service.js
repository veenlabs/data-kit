import axios from 'axios'
import { default as get } from 'lodash/get'
import { default as set } from 'lodash/set'
import React, { useContext, createContext, useState } from 'react'
import produce from 'immer'

//------------ private utils start---------------

// ----------
// Cache
// ----------
let _cache = {}
const CACHE_NAMESPACES = { config: 'config', apis: 'apis', apiStatus: 'api_status', subscribers: 'subscribers' }
const defaultServerName = 'base'
const API_STATUSES = { REQUEST: 'REQUEST', SUCCESS: 'SUCCESS', FAILURE: 'FAILURE' }
const setCacheValue = (namespace, key, value) => {
  set(_cache, [namespace, key], value)
}
const getCacheValue = (namespace, key, defaultValue = null) => {
  return get(_cache, [namespace, key], defaultValue)
}

//------------ private utils end---------------
const emit = (eventName, eventData) => {
  let subscibers = getCacheValue(CACHE_NAMESPACES.subscribers, eventName, [])
  subscibers.forEach((s) => {
    s.handler(eventData)
  })
}
const subscribe = (eventName, key, handler) => {
  let subscibers = getCacheValue(CACHE_NAMESPACES.subscribers, eventName, [])
  setCacheValue(CACHE_NAMESPACES.subscribers, eventName, subscibers.concat({ key, handler }))
}
const unSubscribe = (eventName, key) => {
  let subscibers = getCacheValue(CACHE_NAMESPACES.subscribers, eventName, []).filter((s) => s.key !== key)
  setCacheValue(CACHE_NAMESPACES.subscribers, eventName, subscibers)
}
const setApiStatus = (serverName, apiName, status) => {
  setCacheValue(CACHE_NAMESPACES.apiStatus, serverName + apiName, status)
  emit('API_STATUS_CHANGES', { serverName, apiName, status })
}
const getApiStatus = (serverName, apiName) => getCacheValue(CACHE_NAMESPACES.apiStatus, serverName + apiName)

const getServerConfig = (serverName) => {
  return getCacheValue(CACHE_NAMESPACES.config, serverName)
}
const getApiProps = (severName, apiName) => {
  const apis = getCacheValue(CACHE_NAMESPACES.apis, severName)
  return get(apis, [apiName])
}

const produceApiCallOptions = (apiOptions, serverConfig) => {
  let method = 'get'
  let url = ''

  if (typeof apiOptions === 'string') {
    url = apiOptions
  } else if (apiOptions.length > 0) {
    method = apiOptions[0]
    url = apiOptions[1]
  } else {
    method = apiOptions.method
    url = apiOptions.url
  }

  let options = {
    url: serverConfig.baseUrl + url,
    headers: serverConfig.commonHeaders,
    method,
  }

  return options
}

const _noop = (v) => v
const _noop2 = (par, v) => par(v)
const getBeforeRequestBeforeRequest = (apiOptions, serverConfig) => {
  const beforeRequestPar = get(serverConfig, 'beforeRequest', _noop)
  const beforeRequestCh = get(apiOptions, 'beforeRequest', _noop2)

  const beforeSuccessPar = get(serverConfig, 'beforeSuccess', _noop)
  const beforeSuccessCh = get(apiOptions, 'beforeSuccess', _noop2)

  const beforeRequest = (options) => {
    return beforeRequestCh(beforeRequestPar, options)
  }
  const beforeSuccess = (data) => {
    return beforeSuccessCh(beforeSuccessPar, data)
  }

  return { beforeRequest, beforeSuccess }
}

const handler2 = {
  get(target, apiName, receiver) {
    const serverName = get(target, 'serverName', defaultServerName)
    const serverConfig = getServerConfig(serverName)
    const apiOptions = getApiProps(serverName, apiName)
    let requestOptions = produceApiCallOptions(apiOptions, serverConfig)
    const { beforeRequest, beforeSuccess } = getBeforeRequestBeforeRequest(apiOptions, serverConfig)
    requestOptions = beforeRequest(requestOptions)
    return () => {
      const serviceRequestHandler = async () => {
        setApiStatus(serverName, apiName, API_STATUSES.REQUEST)
        try {
          const result = await axios(requestOptions)
          setApiStatus(serverName, apiName, API_STATUSES.SUCCESS)
          return beforeSuccess(result.data)
        } catch (error) {
          setApiStatus(serverName, apiName, API_STATUSES.FAILURE)
          throw error
        }
      }
      serviceRequestHandler.__type = 'api_service'
      return serviceRequestHandler
    }
  },
}

const proxy2 = new Proxy({}, handler2)

const apiServiceHandler = {
  get(target, prop, receiver) {
    const isServer = !!getServerConfig(prop)
    if (isServer) {
      return new Proxy({ serverName: prop }, handler2)
    } else {
      try {
        return proxy2[prop]()
      } catch (error) {}
    }
  },
}

//------------ Public APIs ---------------

// ----------
// Config
// ----------
const config = (config) => {
  setCacheValue(CACHE_NAMESPACES.config, config.serverName || defaultServerName, config)
}

// ----------
// Extend
// ----------
const addApis = (data) => {
  const { _config, ...apis } = data
  const serverName = get(_config, 'serverName', defaultServerName)
  const apisToStore = { ...getCacheValue(CACHE_NAMESPACES.apis, serverName, {}), ...apis }
  setCacheValue(CACHE_NAMESPACES.apis, serverName, apisToStore)
}

// ----------
// useApiStatus
// ----------
const _getKey = (serverName, apiName) => `${serverName}::${apiName}`
const ApiStatusContext = React.createContext()
const ApiStatusProvider = ({ children }) => {
  const [status, setStatus] = useState({})
  React.useEffect(() => {
    subscribe('API_STATUS_CHANGES', 'ApiStatusProvider_fn', (event) => {
      setStatus((s) => {
        const { serverName, apiName, status } = event
        const key = _getKey(serverName, apiName)
        return produce(s, (draft) => {
          draft[key] = status
        })
      })
    })
    return () => {
      unSubscribe('API_STATUS_CHANGES', 'ApiStatusProvider_fn')
    }
  }, [status])
  return <ApiStatusContext.Provider value={{ status }}>{children}</ApiStatusContext.Provider>
}

const useApiStatus = (apiName, serverName = 'base') => {
  const key = _getKey(serverName, apiName)
  let contextData = useContext(ApiStatusContext)
  return get(contextData, ['status', key], null)
}

const apiService = new Proxy({}, apiServiceHandler)

export { config, addApis, apiService, useApiStatus, ApiStatusProvider }
