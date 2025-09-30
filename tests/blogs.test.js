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

// these below tests only execute inside the console of the test suit chromium
// describe("When not logged in", async () => {
//     test("cannot create blog post", async ()=>{
//         const result = await page.get("http://localhost:3000/api/blogs");
//         expect(result).toEqual({error:"You must log in!"})
//     })
//     test("cannot create blog post", async ()=>{
//         const data = {
//             title:"a",
//             content:"c"
//         }
//         const result = await page.post("http://localhost:3000/api/blogs", data);
//         expect(result).toEqual({error:"You must log in!"})
//     })
// })