const fs = require('fs')
const ytdl = require('ytdl-core')

const downloadmp3 = async function(url, singer){
  const data = await ytdl.getBasicInfo(url)      //waiting for song information
  const {song, artist} = data.videoDetails.media
  const title = song !== undefined ? `${song} - ${artist}` : `${data.videoDetails.title} - ${singer}`
  ytdl(url, {
    format: 'mp4',
    filter: 'audioonly',
  }).pipe(fs.createWriteStream(`./tracks/${title}.mp4`))
  console.log(`${title}.mp4 is downloaded!`)
}

module.exports = downloadmp3