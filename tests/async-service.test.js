import assert from 'assert'
import { addConfiguration, addOperations, asyncService } from '../src/async-service/index'
import { getOperations, getProviderConfig } from '../src/async-service/utils'
import { resetCache } from '../src/helpers/cache'

describe.only('Test async service', function () {
  this.beforeEach(() => {
    resetCache()
  })

  it('addConfiguration: should add provider configuration', function () {
    addConfiguration({ name: 'n1', url: 'http://google.com' })
    addConfiguration({ name: 'n2', url: 'http://yahoo.com' })
    addConfiguration({ name: 'n3', url: 'http://facebook.com' })

    assert.equal(getProviderConfig('n1').name, 'n1')
    assert.equal(getProviderConfig('n1').url, 'http://google.com')
    assert.equal(getProviderConfig('n2').name, 'n2')
    assert.equal(getProviderConfig('n3').name, 'n3')

    assert.equal(getProviderConfig('n4'), null)
  })

  it('addConfiguration: Default name should be picked', () => {
    addConfiguration({
      url: 'http://msn.com',
      runAsyncOperation: async (options) => {
        return { success: options }
      },
    })

    const msn = getProviderConfig('base')

    assert.equal(msn.url, 'http://msn.com')
  })

  it('addConfiguration: Should not overwrite/interfere other config', () => {
    addConfiguration({
      name: 'n1',
      url: 'http://google.com',
      runAsyncOperation: async (options) => {
        return { success: options }
      },
    })

    addConfiguration({
      name: 'n2',
      url: 'http://yahoo.com',
      runAsyncOperation: async (options) => {
        return { success: options }
      },
    })

    addConfiguration({
      url: 'http://msn.com',
      runAsyncOperation: async (options) => {
        return { success: options }
      },
    })

    const google = getProviderConfig('n1')
    const yahoo = getProviderConfig('n2')
    const msn = getProviderConfig('base')

    assert.equal(google.url, 'http://google.com')
    assert.equal(yahoo.url, 'http://yahoo.com')
    assert.equal(msn.url, 'http://msn.com')
  })

  it('Multile-addOperations: Should not overwrite existing operations', function () {
    addConfiguration({
      url: 'http://google.com',
      runAsyncOperation: async (options) => {
        return { success: options }
      },
    })

    addOperations({
      add: { url: 'add', name: 'praveen' },
      remove: { url: 'remove', name: 'praveen' },
    })
    addOperations({
      update: { url: 'update', name: 'praveen' },
      read: { url: 'read', name: 'praveen' },
    })

    const operations = getOperations('base')
    const operationKeys = Object.keys(operations)
    assert.equal(operationKeys.length, 4)
    assert.equal(operationKeys.indexOf('read') > -1, true)
    assert.equal(operationKeys.indexOf('add') > -1, true)
    assert.equal(operationKeys.indexOf('update') > -1, true)
    assert.equal(operationKeys.indexOf('remove') > -1, true)
    assert.equal(operationKeys.indexOf('unownn') < 0, true)
  })

  it('Multile-addOperations(named provider): Should not overwrite existing operations', function () {
    addConfiguration({
      name: 'n1',
      url: 'http://google.com',
      runAsyncOperation: async (options) => {
        return { success: options }
      },
    })

    addOperations({
      _config: {
        providerName: 'n1',
      },
      add: { url: 'add', name: 'praveen' },
      remove: { url: 'remove', name: 'praveen' },
    })
    addOperations({
      _config: {
        providerName: 'n1',
      },
      update: { url: 'update', name: 'praveen' },
      read: { url: 'read', name: 'praveen' },
    })

    const operations = getOperations('n1')
    const operationKeys = Object.keys(operations)
    assert.equal(operationKeys.length, 4)
    assert.equal(operationKeys.indexOf('read') > -1, true)
    assert.equal(operationKeys.indexOf('add') > -1, true)
    assert.equal(operationKeys.indexOf('update') > -1, true)
    assert.equal(operationKeys.indexOf('remove') > -1, true)
    assert.equal(operationKeys.indexOf('unownn') < 0, true)
  })

  it('asyncService: should not call formatOperation if not passed', async function () {
    addConfiguration({
      url: 'http://google.com',
      runAsyncOperation: async (options) => {
        return { success: options }
      },
      formatOperation: (options, provider) => {
        if (options.url === 'add') {
          return { ...options, extra: 2 }
        }
        return { ...options, extra: 1 }
      },
    })

    addOperations({
      add: { url: 'add', name: 'praveen' },
      remove: { url: 'remove', name: 'praveen' },
    })
    addOperations({
      update: { url: 'update', name: 'praveen' },
      read: { url: 'read', name: 'praveen' },
    })

    let add = await asyncService.add()
    assert.equal(add.success.extra, 2)

    let read = await asyncService.read()
    assert.equal(read.success.extra, 1)
  })

  it('asyncService:(named provider) should not call formatOperation if not passed', async function () {
    addConfiguration({
      name: 'n1',
      url: 'http://google.com',
      runAsyncOperation: async (options) => {
        return { success: options }
      },
    })

    addOperations({
      _config: {
        providerName: 'n1',
      },
      add: { url: 'add', name: 'praveen' },
      remove: { url: 'remove', name: 'praveen' },
    })
    addOperations({
      _config: {
        providerName: 'n1',
      },
      update: { url: 'update', name: 'praveen' },
      read: { url: 'read', name: 'praveen' },
    })

    let add = await asyncService.n1.add()
    assert.equal(add.success.extra, undefined)

    let read = await asyncService.n1.read()
    assert.equal(read.success.extra, undefined)
  })

  it('asyncService should  call formatOperation && runAsyncOperation', async function () {
    addConfiguration({
      url: 'http://google.com',
      runAsyncOperation: async (options) => {
        return { success: options }
      },
      formatOperation: (options, provider) => {
        if (options.url === 'add') {
          return { ...options, extra: 2 }
        }
        return { ...options, extra: 1 }
      },
    })

    addOperations({
      add: { url: 'add', name: 'praveen' },
      remove: { url: 'remove', name: 'praveen' },
    })
    addOperations({
      update: { url: 'update', name: 'praveen' },
      read: { url: 'read', name: 'praveen' },
    })

    let add = await asyncService.add()
    assert.equal(add.success.extra, 2)

    let read = await asyncService.read()
    assert.equal(read.success.extra, 1)
  })

  it('asyncService:(named provider) should  call formatOperation && runAsyncOperation', async function () {
    addConfiguration({
      name: 'n1',
      url: 'http://google.com',
      runAsyncOperation: async (options) => {
        return { success: options }
      },
      formatOperation: (options, provider) => {
        if (options.url === 'add') {
          return { ...options, extra: 2 }
        }
        return { ...options, extra: 1 }
      },
    })

    addOperations({
      _config: {
        providerName: 'n1',
      },
      add: { url: 'add', name: 'praveen' },
      remove: { url: 'remove', name: 'praveen' },
    })
    addOperations({
      _config: {
        providerName: 'n1',
      },
      update: { url: 'update', name: 'praveen' },
      read: { url: 'read', name: 'praveen' },
    })

    let add = await asyncService.n1.add()
    assert.equal(add.success.extra, 2)

    let read = await asyncService.n1.read()
    assert.equal(read.success.extra, 1)
  })
})
