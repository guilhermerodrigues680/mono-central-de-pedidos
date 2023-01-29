import { type FastifyPluginAsync } from "fastify";
import type http from "node:http";
import { OrdersService } from "../../services/orders-service.type";
import {
  OrderSchema,
  OrderFormSchema,
  type Order,
} from "../../models/orders.type";
import { SSEManager } from "./sse-manager";

export interface OrdersRoutesPluginOptions {
  ordersService: OrdersService;
}

/**
 * Encapsulates the routes
 * @param fastify  Encapsulated Fastify Instance
 * @param options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
export const ordersRoutes: FastifyPluginAsync<
  OrdersRoutesPluginOptions
> = async (fastify, options) => {
  const { ordersService } = options;
  const sseManager = new SSEManager();

  fastify.get("/orders", {}, async (request, reply) => {
    return reply;
  });

  fastify.post<{ Body: Order; Reply: Order }>(
    "/orders",
    {
      schema: {
        body: OrderFormSchema,
        response: {
          201: OrderSchema,
        },
      },
    },
    async (request, reply) => {
      const order = await ordersService.createOrder(request.body);

      sseManager.broadcastMessage(order);

      reply
        .code(201)
        .header("Location", `${request.routerPath}/${order.id}`)
        .send(order);
    }
  );

  fastify.get("/sse/orders-stream", async (request, reply) => {
    const clientId = request.id;
    sseManager.incomingMessageToSSE(clientId, reply.raw);
    return reply;
  });
};
