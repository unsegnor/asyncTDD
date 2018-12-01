module.exports = function ({dataService1, dataService2, sendingService}) {
  return Object.freeze({
    send
  })

  async function send () {
    var data1 = await dataService1.getData()
    var data2 = await dataService2.getData()

    var composedData = data1 + data2

    await sendingService.send(composedData)
  }
}
