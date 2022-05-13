import { CACHE_NAMESPACES, ASYNC_SERVICE_OPERATION_STATUS_CHANGE_EVENT } from '../helpers/const'

// const emit = (eventName, eventData) => {
//   let subscibers = getCacheValue(CACHE_NAMESPACES.subscribers, eventName, [])
//   subscibers.forEach((s) => {
//     s.handler(eventData)
//   })
// }
// const subscribe = (eventName, key, handler) => {
//   let subscibers = getCacheValue(CACHE_NAMESPACES.subscribers, eventName, [])
//   setCacheValue(CACHE_NAMESPACES.subscribers, eventName, subscibers.concat({ key, handler }))
// }
// const unSubscribe = (eventName, key) => {
//   let subscibers = getCacheValue(CACHE_NAMESPACES.subscribers, eventName, []).filter((s) => s.key !== key)
//   setCacheValue(CACHE_NAMESPACES.subscribers, eventName, subscibers)
// }
const setOperationStatus = (providerName, operationName, status) => {
  setCacheValue(CACHE_NAMESPACES.ASYNC_SERVICE_OPERATION_STATUS, providerName + operationName, status)
  // emit('ASYNC_SERVICE_OPERATION_STATUS_CHANGE_EVENT', { providerName, operationName, status })
}

export { setOperationStatus }
