import assert from 'assert';
import {addConfiguration, addOperation } from '../src/async-service/index'
import { getProviderConfig } from '../src/async-service/utils'

describe('Test async service', function() {
  it('should add provider  configuration', function() {
      addConfiguration({name: 'n1', url:'http://google.com'})
      addConfiguration({name: 'n2', url:'http://yahoo.com'})
      addConfiguration({name: 'n3', url:'http://facebook.com'})

      assert.equal(getProviderConfig('n1').name,'n1')
      assert.equal(getProviderConfig('n1').url,'http://google.com')
      assert.equal(getProviderConfig('n2').name,'n2')
      assert.equal(getProviderConfig('n3').name,'n3')

      assert.equal(getProviderConfig('n4'),null)
  });
});



// apiService.getUser()
// apiService.server2.getProducts()

// types.webType //