const fetch = require('node-fetch')
const fs = require('fs')

// Usage: node index.js [optionalPathToDownload] [optionalPathToM3UFileToAppend]

let args = process.argv.slice()
let customPath = args[2]
let playlistPath = args[3]

const run = async () => {
  var prevSaturday = new Date()
  prevSaturday.setDate(prevSaturday.getDate() - (prevSaturday.getDay() + 1) % 7)
  let dateString = prevSaturday.toISOString().split('T')[0]
  let timestamp = dateString + 'T17:00:00Z'

  let downloadPath = customPath || './downloads'
  let filename = 'positive-vibrations-' + dateString + '.mp3'
  let fullPath = downloadPath + '/' + filename

  let data = await fetch(`https://legacy-api.kexp.org/get_streaming_url?bitrate=256&timestamp=${timestamp}`).then((response) => {
    return response.json()
  })

  if (data && data['sg-url']) {
    console.log('==> Downloading Positive Vibrations ' + dateString + ' to ' + fullPath)
    let response = await fetch(data['sg-url'])
    let writeStream = fs.createWriteStream(fullPath)
    writeStream.on('close', () => {
      console.log('==> Done!')
      if (playlistPath) {
        fs.appendFileSync(playlistPath, '\n' + filename, 'utf8')
        console.log('==> Saved to playlist: ' + playlistPath)
      }
    })
    response.body.pipe(writeStream)
  } else {
    console.log(':( Download error - ' + dateString)
  }
}

run()
