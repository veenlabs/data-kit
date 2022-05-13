import { get, set } from './lodash'

let cache = {}

function setCache(namespace, key, value) {
  set(cache, [namespace, key], value)
}

function getCache(namespace, key, defaultValue) {
  return get(cache, [namespace, key], defaultValue)
}

function resetCache() {
  cache = {}
}

export { setCache, getCache, resetCache }
