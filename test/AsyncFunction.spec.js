const {assert} = require('chai')
const sinon = require('sinon')
const AsyncFunction = require('../src/AsyncFunction')

describe('AsyncFunction', function(){
  let asyncFunction

  beforeEach(function(){
    asyncFunction = AsyncFunction()
  })

  describe('called property', ()=>{
    it('must be true when the function is called', ()=>{
      asyncFunction();
      assert.isTrue(asyncFunction.called)
    })

    it('must be false when the function is not called', ()=>{
      assert.isFalse(asyncFunction.called)
    })
  })

  describe('executed property', ()=>{
    it('must be true when the function ends its asynchronous execution', ()=>{
      asyncFunction.resolve()
      asyncFunction()
      assert.isTrue(asyncFunction.executed)
    })

    it('must be true when the function ends its asynchronous execution resolved after calling', (done)=>{
      asyncFunction().then(function(){
        assert.isTrue(asyncFunction.executed)
        done()
      })
      asyncFunction.resolve()
    })

    it('must be false when the function does not end its execution', ()=>{
      asyncFunction()
      assert.isFalse(asyncFunction.executed)
    })
  })

  describe('resolved property', ()=>{
    it('must be true when the function is resolved without calling it', ()=>{
      asyncFunction.resolve()
      assert.isTrue(asyncFunction.resolved)
    })

    it('must be false when the function is not resolved', ()=>{
      asyncFunction()
      assert.isFalse(asyncFunction.resolved)
    })
  })

  describe('#resolve', function(){
    it('must resolve the returned romise when it was already called', function(done){
      asyncFunction().then(done)
      asyncFunction.resolve()
    })

    it('must not resolve the function when resolve is not called', function(done){
      let executed = false
      asyncFunction().then(function(){
        executed = true
      })

      setTimeout(function(){
        assert.isFalse(executed)
        done()
      }, 1)
    })

    it('must not resolve the function when it is not called', function(){
      asyncFunction.resolve()
    })

    it('must resolve the function when it is called after resolving', function(done){
      asyncFunction.resolve()
      asyncFunction().then(done)
    })

    it('resolve must resolve the function with the resolve value when it was already called', function(done){
      const fakeValue = 'fakeValue'
      asyncFunction.resolvesWith(fakeValue)
      asyncFunction().then(function(responseValue){
        assert.strictEqual(responseValue, fakeValue)
        done()
      })
      asyncFunction.resolve()
    })

    it('resolve must resolve the function with the resolve value when it is called after resolving', function(done){
      const fakeValue = 'fakeValue'
      asyncFunction.resolvesWith(fakeValue)
      asyncFunction.resolve()
      asyncFunction().then(function(responseValue){
        assert.strictEqual(responseValue, fakeValue)
        done()
      })
    })
  })
})
