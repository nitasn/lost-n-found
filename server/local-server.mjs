import express from "express";
import path from "path";
import fs from "fs";

const PORT = 3000;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    // Send OK status for preflight requests
    return res.sendStatus(200);
  }
  
  next();
});


// Dynamically load and register API routes
fs.readdir("./api", (err, fnames) => {
  if (err) return console.error(err);
  fnames.forEach((fname) => {
    if (fname.endsWith(".js") || fname.endsWith(".mjs")) {
      const route = `/api/${path.parse(fname).name}`;
      import(`./api/${fname}`).then(({ default: handler }) => {
        app.use(route, handler);
        console.log("registered", route);
      })
      .catch((err) => {
        console.log("could not register", route, "at", fname, "because", err);
      })
    }
  });
});

app.use((req, res, next) => {
  // Set Cross-Origin-Opener-Policy (COOP) header
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");

  // Set Cross-Origin-Resource-Policy (CORP) header, if needed
  // res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  next();
});

app.use(express.static("web-build"));

// must do this AFTER dymanic routes were added
// app.get("/*", (req, res) => res.sendFile("index.html", { root: "web-build" }));

app.listen(PORT, () => console.log(`local server on http://localhost:3000`));
