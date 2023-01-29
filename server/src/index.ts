import { fastify, configureApiRoutes } from "./api";
import OrdersServiceImpl from "./services/orders-service";

async function start() {
  try {
    const ordersService = new OrdersServiceImpl();

    configureApiRoutes(ordersService);

    await fastify.listen({ port: 3000 });
    const address = fastify.server.address();
    const port = typeof address === "string" ? address : address?.port;
    fastify.log.info({ port });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
