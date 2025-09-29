const puppeteer = require("puppeteer");
jest.setTimeout(30000);
const sessionFactory = require("./factories/sessionFactory")
const userFactory = require("./factories/userFactory")
let browser, page;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3000/')
});

afterEach(async () => {
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

test('When signed in shows logout', async () => {
    // const id = '68d79e218b648135e04e714e';
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
    console.log(session, sig);
    await page.setCookie({ name: 'session', value: session });
    await page.setCookie({ name: 'session.sig', value: sig });
    await page.goto('http://localhost:3000/');
    await page.waitForSelector('a[href="/auth/logout"]');
    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
    expect(text).toEqual('Logout');
});

