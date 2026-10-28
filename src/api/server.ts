import createApp from "./app";
import createConnection from "./database";

const port = process.env.PORT ?? 3000;

async function main() {
  const sequelize = createConnection(process.env.DB_STORAGE ?? "database.sqlite");
  await sequelize.sync();

  createApp().listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
}

main();
