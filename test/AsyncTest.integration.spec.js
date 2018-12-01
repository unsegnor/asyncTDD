const asyncTDD = require('../src/AsyncTDD')()
const asyncTest = asyncTDD.asyncTest
const Sender = require('./Sender')

describe('AsyncTest', function () {
  it('the method must get the data from the dataServices and send them', async () => {
    await asyncTest(async function (getData1, getData2) {
      var sentData

      getData1.resolvesWith('data1')
      getData2.resolvesWith('data2')

      var dataService1 = {
        getData: getData1
      }

      var dataService2 = {
        getData: getData2
      }

      var sendingService = {
        send: function (data) {
          sentData = data
        }
      }

      var sender = Sender({dataService1, dataService2, sendingService})

      await sender.send()

      if (sentData !== 'data1data2') throw new Error(`Expected data1data2 but sent ${sentData}`)
    })
  })

  it('must fail when the method is not waiting for any data result', async () => {
    let failed = false

    async function send (dataService1, dataService2, sendingService) {
      var data1 = dataService1.getData()
      var data2 = dataService2.getData()

      await sendingService.send(data1 + data2)
    }

    await asyncTest(async function (getData1, getData2) {
      var sentData
      getData1.resolvesWith('data1')
      getData2.resolvesWith('data2')

      var dataService1 = {
        getData: getData1
      }

      var dataService2 = {
        getData: getData2
      }

      var sendingService = {
        send: function (data) {
          sentData = data
        }
      }

      await send(dataService1, dataService2, sendingService)

      if (sentData !== 'data1data2') failed = true
    })

    if (!failed) throw new Error('The test should have failed because the send function is not waiting for the data services to end')
  })
})
