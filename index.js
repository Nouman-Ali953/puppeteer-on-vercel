// const app = require("express")();

// let chrome = {};
// let puppeteer;

// if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
//   chrome = require("chrome-aws-lambda");
//   puppeteer = require("puppeteer-core");
// } else {
//   puppeteer = require("puppeteer");
// }
// app.get("/", async (req, res) => { res.send("added one more route") } )

// app.get("/api", async (req, res) => {
//   let options = {};

//   if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
//     options = {
//       args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
//       defaultViewport: chrome.defaultViewport,
//       executablePath: await chrome.executablePath,
//       headless: true,
//       ignoreHTTPSErrors: true,
//     };
//   }

//   try {
//     let browser = await puppeteer.launch(options);

//     let page = await browser.newPage();
//     await page.goto("https://www.google.com");
//     res.send(await page.title());
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// });

// app.listen(process.env.PORT || 3000, () => {
//   console.log("Server started");
// });

// module.exports = app;


const express = require("express");
const app = express();

let puppeteer;
let chromium = {};

if (process.env.VERCEL) {
  puppeteer = require("puppeteer-core");
  chromium = require("@sparticuz/chromium");
} else {
  puppeteer = require("puppeteer");
}

app.get("/", (req, res) => {
  res.send("🟢 Hello from Puppeteer app on Vercel!");
});

app.get("/api", async (req, res) => {
  const options = process.env.VERCEL
    ? {
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      }
    : {
        headless: true,
      };

  try {
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto("https://www.google.com");
    const title = await page.title();
    await browser.close();
    res.send(`✅ Page title: ${title}`);
  } catch (err) {
    console.error("❌ Error launching Puppeteer:", err);
    res.status(500).send("Error: " + err.message);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Server is running");
});

module.exports = app;
