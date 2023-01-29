import { fastify as api } from "./api";

async function start() {
  try {
    await api.listen({ port: 3000 });

    const address = api.server.address();
    const port = typeof address === "string" ? address : address?.port;
    api.log.info({ port });
  } catch (err) {
    api.log.error(err);
    process.exit(1);
  }
}

start();
