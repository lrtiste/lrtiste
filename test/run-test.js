const puppeteer = require('puppeteer');

const wait = (time = 1000) => new Promise(resolve => {
    setTimeout(() => resolve(), time);
});

(async () => {
    const browser = await puppeteer.launch({
        // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    try {
        const page = await browser.newPage();
        page.on('console', ev => console.log(ev.text()));
        await page.goto(`http://localhost:3002/test/dist/index.html`);
        await wait(1000);
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        browser.close();
    }
})();