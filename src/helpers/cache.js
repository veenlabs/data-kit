import { get, set } from './lodash'

let cache = {}

function setCache(namespace, key, value) {
  const path = Array.isArray(key) ? key : [key]
  set(cache, [namespace, ...path], value)
}

function getCache(namespace, key, defaultValue) {
  const path = Array.isArray(key) ? key : [key]
  return get(cache, [namespace, ...path], defaultValue)
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

// function setCacheWithExtendFn(namespace, key, extendFn) {
//   let value = getCache(namespace, key)
//   value = extendFn(value)
//   setCache(namespace, key, value)
//   return value
// }

function resetCache() {
  cache = {}
}
function _logCache() {
  console.log({cache})
}

export { setCache, getCache, resetCache, getCacheWithProduceFn, _logCache }
