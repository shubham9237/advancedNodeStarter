const Page = require("./helpers/page")
let page;

beforeAll(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000/')
});

afterAll(async () => {
    await page.closeBrowser();
});

test('Header has the correct text', async () => {
    const text = await page.getContentsOf('a.brand-logo');
    expect(text).toEqual("Blogster")
});

// test('Clickig login for auth flow', async () => {
//     const text = await page.$eval('a.brand-logo', el => el.innerHTML);
//     await page.click('.right a');
//     const url = await page.url();
//     expect(url).toMatch(/google\.com/) mongodb+srv://shubham:1234@cluster0.ossbj.mongodb.net/myDatabase?retryWrites=true&w=majority
// });

test('When signed in shows logout', async () => {
    await page.login();
    const text = await page.getContentsOf('a[href="/auth/logout"]');
    expect(text).toEqual('Logout');
});

