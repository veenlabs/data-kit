import { getCache, setCache } from '../helpers/cache'
import { CACHE_NAMESPACES } from '../helpers/const'

const emit = (eventName, eventData) => {
  let subscibers = getCache(CACHE_NAMESPACES.ASYNC_SERVICE_EVENTS_SUBSCIBERS, eventName, [])
  subscibers.forEach((s) => {
    s.handler(eventData)
  })
}

const subscribe = (eventName, key, handler) => {
  // key is unique name for handler
  let subscibers = getCache(CACHE_NAMESPACES.ASYNC_SERVICE_EVENTS_SUBSCIBERS, eventName, [])
  setCache(CACHE_NAMESPACES.ASYNC_SERVICE_EVENTS_SUBSCIBERS, eventName, subscibers.concat({ key, handler }))
}
const unSubscribe = (eventName, key) => {
  // key is unique name for handler
  let subscibers = getCache(CACHE_NAMESPACES.ASYNC_SERVICE_EVENTS_SUBSCIBERS, eventName, []).filter((s) => s.key !== key)
  setCache(CACHE_NAMESPACES.ASYNC_SERVICE_EVENTS_SUBSCIBERS, eventName, subscibers)
}

export { emit, subscribe, unSubscribe }
