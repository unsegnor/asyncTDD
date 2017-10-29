const {assert} = require('chai')
const sinon = require('sinon')
const AsyncFunction = require('../src/AsyncFunction')
const asyncTDD = require('../src/AsyncTDD.js')()

describe('AsyncTDD', ()=>{
  describe('getAsyncFunction', ()=>{
    let asyncFunction

    beforeEach(()=>{
        asyncFunction = asyncTDD.getAsyncFunction()
    })

    describe('must return an AsyncTesterFunction function which', ()=>{
      describe('called property', ()=>{
        it('must be true when the function is called', ()=>{
          asyncFunction();
          assert.isOk(asyncFunction.called)
        })

        it('must be false when the function is not called', ()=>{
          assert.isNotOk(asyncFunction.called)
        })
      })

      describe('executed property', ()=>{
        it('must be true when the function ends its asynchronous execution', async ()=>{
          await asyncFunction()
          assert.isOk(asyncFunction.executed)
        })

        it('must be false when the function does not end its execution', ()=>{
          asyncFunction()
          assert.isNotOk(asyncFunction.executed)
        })
      })
    })
  })

  describe('asyncTest', function(){
    describe('when it is called with a function without parameters', function(){
      it('must execute the function', async function(){
        const asyncTest = asyncTDD.asyncTest
        const functionToExecute = sinon.stub()
        await asyncTest(functionToExecute)

        assert.isOk(functionToExecute.called)
      })

      it('must wait for the function to execute to finish', async function(){
        const asyncTest = asyncTDD.asyncTest
        const functionToExecute = asyncTDD.getAsyncFunction()
        await asyncTest(functionToExecute)

        assert.isOk(functionToExecute.executed)
      })
    })

    describe('when it is called with one parameter', function(){
      it('must create an asyncFunction for the parameter', async function(){
        const asyncTest = asyncTDD.asyncTest
        const functionToExecute = function(parameter){
          assert.isOk(parameter.resolve)
        }
        await asyncTest(functionToExecute)
      })

      it('must execute the function twice', async function(){
        const asyncTest = asyncTDD.asyncTest
        const functionToExecuteSpy = sinon.spy()
        const functionToExecute = function(parameter){
          functionToExecuteSpy()
        }
        await asyncTest(functionToExecute)

        assert.isOk(functionToExecuteSpy.calledTwice)
      })

      describe('in the first execution', function(){
        it('must resolve the parameter after the function execution', async function(){
          let execution = 0
          let builtParameter
          const asyncTest = asyncTDD.asyncTest
          const functionToExecute = function(parameter){
            execution++
            if(execution === 1){
              assert.isNotOk(parameter.resolved)
            }
            builtParameter = parameter
          }
          await asyncTest(functionToExecute)
          assert.isOk(builtParameter.resolved)
        })
      })

      describe('in the second execution', function(){
        it('must execute the function with the parameter resolved', async function(){
          let execution = 0
          const asyncTest = asyncTDD.asyncTest
          const functionToExecute = function(parameter){
            execution++
            if(execution === 2){
              assert.isOk(parameter.resolved)
            }
          }
          await asyncTest(functionToExecute)
        })
      })
    })

    describe('when it is called with two parameters', function(){
      let execution = 0
      let builtParameter
      let builtSecondParameter
      let firstParameterResolveSpy
      let secondParameterResolveSpy
      let functionToExecuteSpy
      let asyncTest

      beforeEach(function(){
        execution = 0
        functionToExecuteSpy = sinon.spy()
        asyncTest = asyncTDD.asyncTest
      })

      it('must create an asyncFunction for all the parameters', async function(){
        const functionToExecute = function(parameter, secondParameter){
          assert.isOk(parameter.resolve)
          assert.isOk(secondParameter.resolve)
        }
        await asyncTest(functionToExecute)
      })

      it('must execute the function six times', async function(){
        const functionToExecute = function(parameter, secondParameter){
          functionToExecuteSpy()
        }
        await asyncTest(functionToExecute)

        assert.strictEqual(functionToExecuteSpy.callCount, 6)
      })

      describe('in the first execution', function(){
        it('must resolve both parameters after the function execution', async function(){
          const functionToExecute = function(parameter, secondParameter){
            execution++
            if(execution === 1){
              assert.isNotOk(parameter.resolved)
              assert.isNotOk(secondParameter.resolved)
            }

            builtParameter = parameter
            builtSecondParameter = secondParameter
          }

          await asyncTest(functionToExecute)
          assert.isOk(builtParameter.resolved)
          assert.isOk(builtSecondParameter.resolved)
        })

        it('must resolve the first parameter before the second parameter', async function(){
          const functionToExecute = function(parameter, secondParameter){
            execution++
            if(execution === 1){
              assert.isNotOk(parameter.resolved)
              assert.isNotOk(secondParameter.resolved)
              functionToExecuteSpy()
              firstParameterResolveSpy = sinon.spy(parameter, 'resolve')
              secondParameterResolveSpy = sinon.spy(secondParameter, 'resolve')
            }
          }

          await asyncTest(functionToExecute)
          assert.isOk(functionToExecuteSpy.calledBefore(firstParameterResolveSpy))
          assert.isOk(firstParameterResolveSpy.calledBefore(secondParameterResolveSpy))
        })
      })

      describe('in the second execution', function(){
        it('must execute the function then resolve the second parameter and then resolve the first', async function(){
          const functionToExecute = function(parameter, secondParameter){
            execution++
            if(execution === 2){
              assert.isNotOk(parameter.resolved)
              assert.isNotOk(secondParameter.resolved)
              functionToExecuteSpy()
              firstParameterResolveSpy = sinon.spy(parameter, 'resolve')
              secondParameterResolveSpy = sinon.spy(secondParameter, 'resolve')
            }
          }

          await asyncTest(functionToExecute)
          assert.isOk(functionToExecuteSpy.calledBefore(secondParameterResolveSpy))
          assert.isOk(secondParameterResolveSpy.calledBefore(firstParameterResolveSpy))
        })
      })

      describe('in the third execution', function(){
        it('must resolve the first parameter, then execute the function and then resolve the second parameter', async function(){
          const functionToExecute = function(parameter, secondParameter){
            execution++
            if(execution === 3){
              assert.isOk(parameter.resolved)
              assert.isNotOk(secondParameter.resolved)
              functionToExecuteSpy()
              firstParameterResolveSpy = sinon.spy(parameter, 'resolve')
              secondParameterResolveSpy = sinon.spy(secondParameter, 'resolve')
            }
          }

          await asyncTest(functionToExecute)
          assert.isOk(functionToExecuteSpy.calledBefore(secondParameterResolveSpy))
        })
      })

      describe('in the fourth execution', function(){
        it('must resolve the first parameter, then the second parameter and then execute the function', async function(){
          const functionToExecute = function(parameter, secondParameter){
            execution++
            if(execution === 4){
              assert.isOk(parameter.resolved)
              assert.isOk(secondParameter.resolved)
              functionToExecuteSpy()
              firstParameterResolveSpy = sinon.spy(parameter, 'resolve')
              secondParameterResolveSpy = sinon.spy(secondParameter, 'resolve')
            }
          }
          //TODO: to check this one we could need the resolved date to compare
          await asyncTest(functionToExecute)
        })
      })

      describe('in the fifth execution', function(){
        it('must resolve the second parameter, then execute the function and then resolve the first parameter', async function(){
          const functionToExecute = function(parameter, secondParameter){
            execution++
            if(execution === 5){
              assert.isNotOk(parameter.resolved)
              assert.isOk(secondParameter.resolved)
              functionToExecuteSpy()
              firstParameterResolveSpy = sinon.spy(parameter, 'resolve')
              secondParameterResolveSpy = sinon.spy(secondParameter, 'resolve')
            }
          }
          await asyncTest(functionToExecute)
          assert.isOk(functionToExecuteSpy.calledBefore(secondParameterResolveSpy))
        })
      })

      describe('in the sixth execution', function(){
        it('must execute the function with both parameters resolved', async function(){
          const functionToExecute = function(parameter, secondParameter){
            execution++
            if(execution === 6){
              assert.isOk(parameter.resolved)
              assert.isOk(secondParameter.resolved)
            }
          }
          await asyncTest(functionToExecute)
        })
      })
    })
  })
})
