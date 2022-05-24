import addConfiguration from './addConfiguration'
import addOperations from './addOperations'
import asyncService from './asyncService'
import AsyncServiceStatusProvider from './AsyncServiceStatusProvider'
import useAsyncServiceStatus from './useAsyncServiceStatus'
import { ASYNC_SERVICE_PROVIDER_WEB_API_TYPE, ASYNC_SERVICE_API_ERROR_NAME } from '../helpers/const'
import { get } from '../helpers/lodash'

const types = {
  webType: ASYNC_SERVICE_PROVIDER_WEB_API_TYPE,
  apiError: ASYNC_SERVICE_API_ERROR_NAME,
}
const isApiError = (error) => get(error, 'name') === ASYNC_SERVICE_API_ERROR_NAME

export { addConfiguration, addOperations, asyncService, types, AsyncServiceStatusProvider, useAsyncServiceStatus, isApiError }
