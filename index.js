const puppeteer = require('puppeteer')

const megaportURL = 'https://www.megaportfest.com/lineup.php?act=1'
const firstSearchResult = 'ytmusic-shelf-renderer.style-scope:nth-child(1) > div:nth-child(4) > ytmusic-responsive-list-item-renderer:nth-child(1) > a:nth-child(1)'

//  get artists list in megaportfest.com
;(async () =>{
  const browser = await puppeteer.launch({
    product: 'firefox',
  })
  const page = await browser.newPage()
  await page.goto(megaportURL)
  // choose the first span in #artist_info
  const artistsLists = await page.$$eval('#artist_info span:first-of-type', artists => artists.map(artist => artist.textContent))
  // list.push(...artistsLists)
  console.log(artistsLists)

  await browser.close()
})()
