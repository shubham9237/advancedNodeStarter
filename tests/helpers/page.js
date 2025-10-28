const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    const customPage = new CustomPage(page, browser);

    // In CustomPage.js
    // ...
    return new Proxy(customPage, {
      get: function (target, property) {
        // Priority 1: Check CustomPage methods/properties
        if (customPage[property]) {
          return customPage[property];
        }

        // Priority 2: Check Page methods/properties and BIND them to the page object
        if (page[property]) {
          if (typeof page[property] === 'function') {
            return page[property].bind(page);
          }
          return page[property];
        }

        // Priority 3: Check Browser methods/properties and BIND them
        if (browser[property]) {
          if (typeof browser[property] === 'function') {
            return browser[property].bind(browser);
          }
          return browser[property];
        }
      }
    });
    // ...    
  }

  constructor(page, browser) {
    this.page = page;
    this.browser = browser; // Store the browser object

  }

  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });
    await this.page.goto('http://localhost:3000/blogs');
    await this.page.waitForSelector('a[href="/auth/logout"]');
  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }

  get(path) {
    return this.page.evaluate(_path => {
      return fetch(_path, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json());
    }, path);
  }

  async closeBrowser() {
    await this.browser.close();
  }

  post(path, data) {
    return this.page.evaluate(
      (_path, _data) => {
        return fetch(_path, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(_data)
        }).then(res => res.json());
      },
      path,
      data
    );
  }

  execRequests(actions) {
    return Promise.all(
      actions.map(({ method, path, data }) => {
        return this[method](path, data);
      })
    );
  }
}

module.exports = CustomPage;
