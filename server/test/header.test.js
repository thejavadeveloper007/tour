const puppeteer = require('puppeteer');
let browser, page;
beforeEach(async() =>{
     browser = await puppeteer.launch({
        headless: false
    });
     page = await browser.newPage();
    await page.goto('http://localhost:3000/', { waitUntil: "domcontentloaded" });
})

afterEach(async() =>{
    await browser.close();
})
test('element testing',async () =>{
   const text = await page.$eval('li.home', el => el.innerHTML); //here $eval is a name of the function only
   console.log('df', text);
})

test('match link', async() =>{
    // const ele = await page.waitForSelector('.menu-bar li');
    // console.log('ele',ele);
    // await ele.click(); 
    const response = await Promise.all([
        page.waitForNavigation(),
        page.click('.menu-bar li')
    ]);
    console.log('res',response);
    const url = await page.url();
    console.log('url',url);
    expect(url).toMatch(/localhost\:3000/);
    // expect(url).toMatch(/accounts\.google\.com/); //for testing auth flow
})