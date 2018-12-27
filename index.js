const fetch = require('node-fetch')
const fs = require('fs')

// Usage: node index.js [optionalPathToDownload]

let customPath = process.argv.slice(2)

const run = async () => {
  var prevSaturday = new Date()
  prevSaturday.setDate(prevSaturday.getDate() - (prevSaturday.getDay() + 1) % 7)
  let dateString = prevSaturday.toISOString().split('T')[0]
  let timestamp = dateString + 'T17:00:00Z'

  let downloadPath = customPath || './downloads'
  downloadPath = downloadPath + '/positive-vibrations-' + dateString + '.mp3'

  let data = await fetch(`https://legacy-api.kexp.org/get_streaming_url?bitrate=256&timestamp=${timestamp}`).then((response) => {
    return response.json()
  })

  if (data && data['sg-url']) {
    console.log('==> Downloading Positive Vibrations ' + dateString + ' to ' + downloadPath)
    let response = await fetch(data['sg-url'])
    response.body.pipe(fs.createWriteStream(downloadPath))
  } else {
    console.log(':( Download error - ' + dateString)
  }
}

run()
