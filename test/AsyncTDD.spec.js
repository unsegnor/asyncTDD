const {assert} = require('chai');
const asyncTDD = require('../src/AsyncTDD.js')();

describe('AsyncTDD', ()=>{
  describe('getAsyncFunction', ()=>{
    let asyncFunction;

    beforeEach(()=>{
        asyncFunction = asyncTDD.getAsyncFunction();
    });

    describe('must return an AsyncTesterFunction function which', ()=>{
      describe('called property', ()=>{
        it('must be true when the function is called', ()=>{
          asyncFunction();
          assert.isOk(asyncFunction.called);
        })

        it('must be false when the function is not called', ()=>{
          assert.isNotOk(asyncFunction.called);
        })
      });

      describe('executed property', ()=>{
        it('must be true when the function ends its asynchronous execution', async ()=>{
          await asyncFunction();
          assert.isOk(asyncFunction.executed);
        })

        it('must be false when the function does not end its execution', ()=>{
          asyncFunction();
          assert.isNotOk(asyncFunction.executed);
        })
      });
    });
  });
});
