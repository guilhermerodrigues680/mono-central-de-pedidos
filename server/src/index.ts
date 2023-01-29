import * as api from "./api";

async function start() {
  try {
    await api.server.listen({ port: 3000 });

    const address = api.server.server.address();
    const port = typeof address === "string" ? address : address?.port;
    api.server.log.info({ port });
  } catch (err) {
    api.server.log.error(err);
    process.exit(1);
  }
}

start();
