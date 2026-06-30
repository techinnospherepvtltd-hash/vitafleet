const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../outputs");
const port = Number(process.argv[2] || process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
  const filePath = path.join(root, urlPath === "/" ? "vdlms-clickable-prototype.html" : urlPath);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
    res.end(content);
  });
}).listen(port, "127.0.0.1", () => {
  console.log(`VDLMS prototype running at http://127.0.0.1:${port}`);
});
