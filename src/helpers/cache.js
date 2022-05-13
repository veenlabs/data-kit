import { get, set } from './lodash'

let cache = {}

function setCache(namespace, key, value) {
  set(cache, [namespace, key], value)
}

function getCache(namespace, key, defaultValue) {
  return get(cache, [namespace, key], defaultValue)
}

// This function will try to read cache, if not found then it will call producerFn. Value returned from producerFn will be set and returned
function getCacheWithProduceFn(namespace, key, producerFn) {
  let value = getCache(namespace, key)
  if (!value) {
    value = producerFn()
    setCache(namespace, key, value)
  }
  return value
}

function resetCache() {
  cache = {}
}

export { setCache, getCache, resetCache, getCacheWithProduceFn }
