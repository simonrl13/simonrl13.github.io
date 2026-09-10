/* Minimal static file server for previewing the exported site.
   Usage: node scripts/serve.mjs [dir] [port]   (default: out 4321) */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.argv[2] || "out";
const port = Number(process.argv[3] || 4321);
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
};

createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    p = normalize(p).replace(/^(\.\.[/\\])+/, "");
    let fp = join(root, p);
    try {
      if ((await stat(fp)).isDirectory()) fp = join(fp, "index.html");
    } catch {
      if (!extname(fp)) fp = fp + ".html";
    }
    const body = await readFile(fp);
    res.writeHead(200, {
      "content-type": types[extname(fp)] || "application/octet-stream",
    });
    res.end(body);
  } catch {
    try {
      res.writeHead(404, { "content-type": "text/html" });
      res.end(await readFile(join(root, "404.html")));
    } catch {
      res.writeHead(404);
      res.end("not found");
    }
  }
}).listen(port, () =>
  console.log(`serving ${root} on http://localhost:${port}`),
);
