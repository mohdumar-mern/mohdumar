// generate-sitemap.js
import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";

const sitemap = new SitemapStream({
  hostname: "https://mohdumar.online",
});

const writeStream = createWriteStream("./public/sitemap.xml");

sitemap.pipe(writeStream);

[
  "/",
  "/about",
  "/projects",
  "/skills",
  "/services",
  "/contact-us",
].forEach((url) => sitemap.write({ url }));

sitemap.end();

await streamToPromise(sitemap);