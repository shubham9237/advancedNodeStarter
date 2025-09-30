const Page = require("./helpers/page")
let page;

beforeAll(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000')
});

afterAll(async () => {
    await page.closeBrowser();
});

test('When logged in can see blog create form', async () => {
    await page.login();
    const text = await page.getContentsOf('a.brand-logo');
    expect(text).toEqual("Blogster")

    await page.click('a.btn-floating')
    const formLabel = await page.getContentsOf('form label');
    expect(formLabel).toEqual("Blog Title")


});
