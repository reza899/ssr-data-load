import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import path from "path";
import fs from "fs";
import App from "./src/App";

const app = express();

app.use(express.static("./build", { index: false }));

const coins = [
  { name: "Bitcoin", price: "47000" },
  { name: "Ethereum", price: "3300" },
  { name: "cardano", price: "3" },
];

app.get("/api/articles", (req, res) => {
  const loadedCoins = coins;
  res.json(loadedCoins);
});

app.get("/*", (req, res) => {
  const reactApp = renderToString(<App />);

  const templateFile = path.resolve("./build/index.html");
  fs.readFile(templateFile, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }

    return res.send(
      data.replace('<div id="root"></div>', `<div id="root">${reactApp}</div>`)
    );
  });
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
