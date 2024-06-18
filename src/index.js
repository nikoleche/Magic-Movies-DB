const express = require("express");
const { configHbs } = require("./config/hbs");
const { configExpress } = require("./config/express");
const { configRoutes } = require("./config/routes");
const { configDatabase } = require("./config/database");

const PORT = 3000;

async function start() {
  const app = express();

  await configDatabase();
  configHbs(app);
  configExpress(app);
  configRoutes(app);

  app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
  });
}

start();
