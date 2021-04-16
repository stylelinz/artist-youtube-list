const puppeteer = require('puppeteer')

const megaportURL = 'https://www.megaportfest.com/lineup.php?act=1'
const ytMusicURL = 'https://music.youtube.com'

;(async () =>{
  const browser = await puppeteer.launch({
    product: 'firefox',
    // headless: false,
    executablePath: '/lib/firefox/firefox'
  })
  const page = await browser.newPage()
  // artists list in megaportfest.com
  await page.goto(megaportURL)

  // choose the first span in #artist_info
  const artistsLists = await page.$$eval('#artist_info span:first-of-type', artists => artists.map(artist => artist.textContent))

  // goto search result of the artist in Youtube music page
  await page.goto(`${ytMusicURL}/search?q=${artistsLists[0]}`)

  // choose the first href and get into it 
  const firstResult = await page.$eval('a.ytmusic-responsive-list-item-renderer', anchor => anchor.getAttribute('href'))
  await page.goto(`${ytMusicURL}${firstResult}`)
  // await page.screenshot({path:'example.png'})

  await browser.close()
})()
