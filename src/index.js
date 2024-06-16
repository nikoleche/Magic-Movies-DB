const express = require("express");
const { configHbs } = require("./config/hbs");
const { configExpress } = require("./config/express");
const { router } = require("./config/routes");
const { configDatabase } = require("./config/database");

const PORT = 3000;

async function start() {
  const app = express();

  await configDatabase();
  configHbs(app);
  configExpress(app);
  app.use(router);

  app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
  });
}

start();
