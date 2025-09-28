const puppeteer = require("puppeteer");
jest.setTimeout(30000);

let browser, page;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3000/')
});

afterEach(async ()=>{
   await browser.close();
});

test('Header has the correct text', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual("Blogster")
});

test('Clickig login for auth flow', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    await page.click('.right a');
    const url = await page.url();
    expect(url).toMatch(/google\.com/)
});