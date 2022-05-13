import assert from 'assert';
import { getCache, setCache, resetCache } from '../src/helpers/cache'

describe('Test cache', function() {

  it('should set and read cache values',()=>{
    setCache('test', 'key1', 1)
    assert.equal(getCache('test','key1'),1)
  })

  it('should not interfere with other key',()=>{
    setCache('test', 'key1', 1)
    assert.equal(getCache('test','key1'),1)

    setCache('test', 'key2', 2)
    assert.equal(getCache('test','key2'),2)

    // different namespace
    assert.equal(getCache('test2','key2','def'),'def')
  })

  it('should return default value if key is not set',()=>{
    assert.equal(getCache('test','key3',3),3)
  })

  it('should reset the cache',()=>{
    setCache('test', 'key4', 4)
    assert.equal(getCache('test','key4'),4)
    resetCache()
    assert.equal(getCache('test','key4','def'),'def')
  })

});
