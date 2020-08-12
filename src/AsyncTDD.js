'use strict'

const AsyncFunction = require('../src/AsyncFunction')
const allCombinations = require('allcombinations')

function AsyncTDD () {
  return Object.freeze({
    getAsyncFunction,
    asyncTest
  })

  function getAsyncFunction () {
    let asyncFunction = async () => {
      asyncFunction.called = true
      await wait(1)
      asyncFunction.executed = true
    }

    asyncFunction.called = false
    asyncFunction.executed = false
    
    return asyncFunction
  }

  function wait (time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time)
    })
  }

  function getPromiseParameters (mainFunction) {
    let promiseParameters = []
    for (let i = 0; i < mainFunction.length; i++) {
      promiseParameters.push({
        asyncFunction: AsyncFunction()
      })
    }
    return promiseParameters
  }

  function getFunctionsToResolvePromiseParameters (promiseParameters) {
    let functionsToResolvePromiseParameters = []
    promiseParameters.forEach(function (parameter) {
      functionsToResolvePromiseParameters.push(function () {
        parameter.asyncFunction.resolve()
      })
    })
    return functionsToResolvePromiseParameters
  }

  function getMainFunctionExecution (mainFunction, promiseParameters) {
    return async function () {
      let parameterPromises = getParameterPromises(promiseParameters)
      await mainFunction.apply(null, parameterPromises)
    }
  }

  function getParameterPromises (promiseParameters) {
    let parameterPromises = []
    promiseParameters.forEach(function (parameter) {
      parameterPromises.push(parameter.asyncFunction)
    })
    return parameterPromises
  }

  function getPermutations (mainFunction, promiseParameters) {
    let permutations = []
    let mainFunctionExecution = getMainFunctionExecution(mainFunction, promiseParameters)
    let functionsToResolvePromiseParameters = getFunctionsToResolvePromiseParameters(promiseParameters)
    let permutationsGenerator = allCombinations([mainFunctionExecution, ...functionsToResolvePromiseParameters])
    for (let permutation of permutationsGenerator) {
      permutations.push(permutation)
    }
    return permutations
  }

  async function executePermutation (permutation) {
    let executions = []
    for (let fnToExecute of permutation) {
      executions.push(fnToExecute())
    }
    await Promise.all(executions)
  }

  function resetParameterPromises (promiseParameters) {
    promiseParameters.forEach(function (parameter) {
      parameter.asyncFunction = AsyncFunction()
    })
  }

  async function asyncTest (mainFunction) {
    let promiseParameters = getPromiseParameters(mainFunction)
    let permutations = getPermutations(mainFunction, promiseParameters)
    for (let permutation of permutations) {
      await executePermutation(permutation)
      resetParameterPromises(promiseParameters)
    }
  }
}

module.exports = AsyncTDD
