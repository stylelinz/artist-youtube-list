const fs = require('fs')
const ytdl = require('ytdl-core')

const videoURL = 'https://www.youtube.com/watch?v=qrI2wuWsuBc'

const downloadmp3 = async function(url){
  const data = await ytdl.getBasicInfo(videoURL)      //waiting for song information
  const {album, song, artist} = data.videoDetails.media
  const title = `[${album}]${song}-${artist}`
  ytdl(url, {
    format: 'mp3',
    filter: 'audioonly',
  }).pipe(fs.createWriteStream(`${title}.mp3`))
}

downloadmp3(videoURL)
// await ytdl(videoURL, {
//   format: 'mp3',
//   filter: 'audioonly'
// }).pipe(fs.createWriteStream('song.mp3'))