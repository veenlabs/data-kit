import { get, identity } from '../helpers/lodash'

function _wrapperCreator(type) {
  return (fn) => {
    return {
      handler: fn,
      type: type,
    }
  }
}

function _isWrapperCheck(type) {
  return (handler) => {
    return get(handler, ['type']) === type
  }
}

const _extractor = (handler) => {
  return handler.handler
}

const Async = _wrapperCreator('__asyncFn')
const isAsync = _isWrapperCheck('__asyncFn')

const Reducer = _wrapperCreator('__reducer')
const isReducer = _isWrapperCheck('__reducer')

const Saga = _wrapperCreator('__saga')
const isSaga = _isWrapperCheck('__saga')

const extractSaga = _extractor
const extractReducer = _extractor
const extractAsync = _extractor

export { Async, isAsync, Reducer, isReducer, Saga, isSaga, extractSaga, extractReducer, extractAsync }
