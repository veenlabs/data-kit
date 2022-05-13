import addConfiguration from './addConfiguration'
import addOperations from './addOperations'
import asyncService from './asyncService'
import { ASYNC_SERVICE_PROVIDER_WEB_API_TYPE } from '../helpers/const'

const types = {
  webType: ASYNC_SERVICE_PROVIDER_WEB_API_TYPE,
}

export { addConfiguration, addOperations, asyncService, types }