const puppeteer = require('puppeteer')

const megaportURL = 'https://www.megaportfest.com/lineup.php?act=1'
const ytMusicURL = 'https://music.youtube.com'

  ; (async () => {
    const browser = await puppeteer.launch({
      executablePath: '/bin/google-chrome-stable',
      headless: false,
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

    // Click 'view more' button
    await page.waitForSelector('a.ytmusic-shelf-renderer')
    const playlist = await page.$eval('a.ytmusic-shelf-renderer', anchor => anchor.getAttribute('href'))
    await page.goto(`${ytMusicURL}${playlist}`)

    // 等待曲目元素在瀏覽器畫面上渲染完畢，取title的innerText
    // 用page.evaluate()只是因為這是我之前用過的方法，應該用$eval處理也沒問題

    await page.waitForSelector('yt-formatted-string.title a')
    const tracks = await page.evaluate(() => {
      const container = []
      const allAnchor = document.querySelectorAll('yt-formatted-string.title a')
      allAnchor.forEach(node => {
        container.push(node.getAttribute('href'))
      })
      return container
    })
    console.log(tracks)
    await browser.close()
  })()
