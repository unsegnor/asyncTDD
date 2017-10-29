'use strict';

function AsyncFunction() {
  let asyncFunction = function(){
    asyncFunction.called = true
    return new Promise(function(resolve){
      if(asyncFunction.isPromiseResolved){
        resolve(asyncFunction.resolveValue)
        asyncFunction.executed = true
      }else{
        asyncFunction.resolvePromise = resolve
      }
    })
  }

  asyncFunction.resolve = function(){
    if(asyncFunction.resolvePromise){
      asyncFunction.resolvePromise(asyncFunction.resolveValue)
      asyncFunction.executed = true
    } else {
      asyncFunction.isPromiseResolved = true
    }
    asyncFunction.resolved = true
  }

  asyncFunction.resolvesWith = function(value){
    asyncFunction.resolveValue = value
  }

  return asyncFunction
}

module.exports = AsyncFunction;
