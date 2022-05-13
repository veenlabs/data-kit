import assert from 'assert'
import { addConfiguration, addOperations, asyncService } from '../src/async-service/index'
import { getProviderConfig } from '../src/async-service/utils'

describe.only('Test async service', function () {
  it('should add provider configuration', function () {
    addConfiguration({ name: 'n1', url: 'http://google.com' })
    addConfiguration({ name: 'n2', url: 'http://yahoo.com' })
    addConfiguration({ name: 'n3', url: 'http://facebook.com' })

    assert.equal(getProviderConfig('n1').name, 'n1')
    assert.equal(getProviderConfig('n1').url, 'http://google.com')
    assert.equal(getProviderConfig('n2').name, 'n2')
    assert.equal(getProviderConfig('n3').name, 'n3')

    assert.equal(getProviderConfig('n4'), null)
  })

  it('should make api calls', async function (done) {
    addConfiguration({
      name: 'n1',
      url: 'http://google.com',
      runAsyncOperation: async (options) => {
        return options
        // return { success: options}
      },
      formatOperation: (provider, options) => {
        console.log(options)
        return options
        // return {...options, extra:1}
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

    try {
      let res = await asyncService.n1.add()
      // // let res2 = await res
      console.log({ res })
    } catch (error) {
      console.log(error)
    }

    done()
  })
})

// apiService.getUser()
// apiService.server2.getProducts()

// types.webType //
