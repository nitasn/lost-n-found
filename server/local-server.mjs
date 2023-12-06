import express from "express";
import path from "path";
import fs from "fs";

const PORT = 3000;

const app = express();

// CORS middleware (allow requests from any origin)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

// Dynamically load and register API routes
fs.readdir("./api", (err, fnames) => {
  if (err) return console.error(err);
  fnames.forEach((fname) => {
    if (fname.endsWith(".js") || fname.endsWith(".mjs")) {
      import(`./api/${fname}`).then(({ default: handler }) => {
        const route = `/api/${path.parse(fname).name}`;
        app.use(route, handler);
        console.log("registered", route);
      });
    }
  });
});

app.listen(PORT, () => console.log(`local server on http://localhost:3000`));
