import { takeLatest } from 'redux-saga/effects'
import { CACHE_NAMESPACES } from '../helpers/const'
import { getCache, setCache } from '../helpers/cache'
import { get } from '../helpers/lodash'

const defaultPreferences = {
  defaultSaga: takeLatest,
  loggingEnabled: true,
}

/**
 *  beforeHandleSaga: function*(){}
 *  afterSuccessHandleSaga: function*(){}
 *  afterFailHandleSaga: function*(){}
 *  defaultSaga : takeLatest
 */
function addPreferences(preferenes) {
  setCache(CACHE_NAMESPACES.STATE_SERVICE_PREFERENCES, 'preferences', { ...defaultPreferences, ...preferenes })
}

function getAllPreferences() {
  return { ...defaultPreferences, ...getCache(CACHE_NAMESPACES.STATE_SERVICE_PREFERENCES, 'preferences') }
}
function getPreferences(path) {
  return get(getAllPreferences(), [path])
}

export { getAllPreferences, getPreferences }
export default addPreferences
