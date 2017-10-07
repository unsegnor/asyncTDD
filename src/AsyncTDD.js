'use strict';

function AsyncTDD() {
  return Object.freeze({
    getAsyncFunction
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
}

module.exports = AsyncTDD;
