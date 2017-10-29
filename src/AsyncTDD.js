'use strict';

const AsyncFunction = require('../src/AsyncFunction')
const allCombinations = require('allcombinations')

function AsyncTDD() {
  return Object.freeze({
    getAsyncFunction,
    asyncTest
  });

  function getAsyncFunction(){
    let asyncFunction = async ()=>{
      asyncFunction.called = true;
      await wait(1);
      asyncFunction.executed = true;
    };

    return asyncFunction;
  }

  function wait(time){
    return new Promise((resolve)=>{
      setTimeout(resolve, time);
    });
  }

  async function asyncTest(fn){
    let asyncFunctionObjects = []
    for(let i=0; i<fn.length; i++){
      asyncFunctionObjects.push({
        asyncFunction: AsyncFunction()
      })
    }

    let asyncFunctionsExecution = []
    asyncFunctionObjects.forEach(function(asyncFunctionObject){
      asyncFunctionsExecution.push(function(){
        asyncFunctionObject.asyncFunction.resolve()
      })
    })

    let functionExecution = async function(){
      let asyncFunctions = []
      asyncFunctionObjects.forEach(function(asyncFunctionObject){
        asyncFunctions.push(asyncFunctionObject.asyncFunction)
      })
      await fn.apply(null, asyncFunctions)
    }

    let permutations = []
    let permutationsGenerator = allCombinations([functionExecution,...asyncFunctionsExecution])
    for (let permutation of permutationsGenerator) {
      permutations.push(permutation)
    }

    for(let permutation of permutations){
      for(let fnToExecute of permutation){
        await fnToExecute()
      }

      asyncFunctionObjects.forEach(function(asyncFunctionObject){
        asyncFunctionObject.asyncFunction = AsyncFunction()
      })
    }
  }
}

module.exports = AsyncTDD;
