const puppeteer = require('puppeteer')
const ytdownloader = require('./youtube')

const megaportURL = 'https://www.megaportfest.com/lineup.php?act=1'
const ytMusicURL = 'https://music.youtube.com'

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome',
    headless: false,
  })
  const page = await browser.newPage()
  page.setDefaultTimeout(10000)

  // Get all artists in MegaPortFest.com
  // 爬取所有大港開唱的所有來賓名單
  const artistsLists = await getArtistList(page)

  for (const artist of artistsLists) {
    const tracks = await getArtistTracks(page, artist)
    if (tracks){
      for (const track of tracks) {
        await ytdownloader(`${ytMusicURL}${track}`, artist)
      }
    }
  }

  await browser.close()
})()


const getArtistList = async (page) => {
  // artists list in megaportfest.com
  await page.goto(megaportURL)

  // choose and return every first span in #artist_info
  const artistsLists = await page.$$eval('#artist_info span:first-of-type', artists => artists.map(artist => artist.textContent))
  return artistsLists
}

const getArtistTracks = async (page, artist) => {
  // goto search result of the artist in Youtube music page
  // 在ytmusic上面搜尋歌手的關鍵字
  console.log(`Searching for artist ${artist}`)
  await page.goto(`${ytMusicURL}/search?q=${artist}`)

  // choose the first href and get into it
  // 跳選到第一個搜尋結果
  const firstResult = await page.$eval('a.ytmusic-responsive-list-item-renderer', anchor => anchor.getAttribute('href'))
  // return if the first result isn't a channel
  // 如果搜尋結果不是頻道的話就略過
  if (!firstResult.includes('channel')) return

  // get into the ytmusic channel page
  // 進入ytmusic的頻道頁面
  await page.goto(`${ytMusicURL}${firstResult}`)
  // 如果清單內沒有連結的話，就跳過
  try {
    await page.waitForSelector('a.ytmusic-shelf-renderer')
    const playlist = await page.$eval('a.ytmusic-shelf-renderer', anchor => anchor.getAttribute('href'))

    // get all tracks in the channel
    await page.goto(`${ytMusicURL}${playlist}`)
    // 等待曲目元素在瀏覽器畫面上渲染完畢，取所有title的href
    await page.waitForSelector('yt-formatted-string.title a', {})
    const tracks = await page.$$eval('yt-formatted-string.title a', anchors => anchors.map(anchor => anchor.getAttribute('href').match(/[^&]*/)[0]))

    console.log(`Artist ${artist} is completed! `)

    return tracks
  } catch (error) {
    console.log(`Found error at ${artist}: ${error}`)
    return null
  }

}
