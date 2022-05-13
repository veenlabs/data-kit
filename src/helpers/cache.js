import { get, set } from './lodash'

let cache = {}

const NAMESPACES = { API_SERVICE_CONFIG: 'API_SERVICE_CONFIG', API_SERVICES_API_OPTIONS: 'API_SERVICES_API_OPTIONS' }

function setCache(namespace, key, value) {
  set(cache, [namespace, key], value)
}

function getCache(namespace, key, defaultValue) {
  return get(cache, [namespace, key], defaultValue)
}

function resetCache() {
  cache = {}
}

export { NAMESPACES, setCache, getCache, resetCache }
