const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
const minimist = require('minimist')

var args = minimist(process.argv.slice(2))

var usage = `
  Usage: node index.js [options]

  Options:
    --dir           Path to download file || ./downloads
    --weekday       Number of day of week to fetch || 1 (Saturday)
    --hour          Hour of day in UTC to fetch || 17 (9am PST)
    --title         Show title for filename || 'positive-vibrations'
    --playlistPath  Optional path to M3U file to append
    --version       Print out which version is running
    --help          Print this help message
`

if (args.version || args.v) {
  console.log(JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8')).version)
  process.exit(0)
}

if (args.help || args.h) {
  process.stderr.write(usage)
  process.exit(1)
}

const run = async () => {
  let weekday = args.weekday || 1
  let hour = args.hour || 17
  let title = args.title || 'positive-vibrations'

  var prevWeekday = new Date()
  prevWeekday.setDate(prevWeekday.getDate() - (prevWeekday.getDay() + weekday) % 7)
  let dateString = prevWeekday.toISOString().split('T')[0]
  let timestamp = dateString + 'T' + hour + ':00:00Z'

  let data = await fetch(`https://legacy-api.kexp.org/get_streaming_url?bitrate=256&timestamp=${timestamp}`).then((response) => {
    return response.json()
  })

  if (data && data['sg-url']) {
    let downloadPath = args.dir || './downloads'
    let filename = title + '-' + dateString + '.mp3'
    let fullPath = downloadPath + '/' + filename

    console.log('==> Downloading ' + title + ' ' + dateString + ' to ' + fullPath)
    let response = await fetch(data['sg-url'])
    let writeStream = fs.createWriteStream(fullPath)
    writeStream.on('close', () => {
      console.log('==> Done!')
      if (args.playlistPath) {
        fs.appendFileSync(args.playlistPath, '\n' + filename, 'utf8')
        console.log('==> Saved to playlist: ' + args.playlistPath)
      }
    })
    response.body.pipe(writeStream)
  } else {
    console.log(':( Download error - ' + dateString)
  }
}

run()
