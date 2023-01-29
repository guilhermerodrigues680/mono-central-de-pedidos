import { type FastifyPluginAsync } from "fastify";
import type http from "node:http";
import { v4 as uuidv4 } from "uuid";
import { Order, OrderForm, OrderType } from "./orders.types";

export interface OrdersRoutesPluginOptions {}

// Map para armazenar as referências aos responses SSE
const sseResponses = new Map<
  string,
  http.ServerResponse<http.IncomingMessage>
>();

// Map para armazenar os pedidos
const orders = new Map<string, OrderType>();

/**
 * Encapsulates the routes
 * @param fastify  Encapsulated Fastify Instance
 * @param options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
export const ordersRoutes: FastifyPluginAsync<
  OrdersRoutesPluginOptions
> = async (fastify, options) => {
  fastify.get("/orders", {}, async (request, reply) => {
    return reply;
  });

  fastify.post<{ Body: OrderType; Reply: OrderType }>(
    "/orders",
    {
      schema: {
        body: OrderForm,
        response: {
          201: Order,
        },
      },
    },
    async (request, reply) => {
      const order: OrderType = {
        id: uuidv4(),
        description: request.body.description,
        status: "CREATED",
      };
      orders.set(order.id, order);

      // Enviando o evento de novo pedido aos clientes SSE
      sseResponses.forEach((sseR) => {
        sseR.write(
          `event: new-order\ndata: ${JSON.stringify(order)}\n\n`,
          (err) => {
            console.debug("sseR.write callback", err);
          }
        );
      });

      reply
        .code(201)
        .header("Location", `${request.routerPath}/${order.id}`)
        .send(order);
    }
  );

  fastify.get("/sse/orders-stream", async (request, reply) => {
    const headers = {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    };
    reply.raw.writeHead(200, headers);

    const clientId = request.id;
    sseResponses.set(clientId, reply.raw);

    // Enviando um evento inicial para o cliente
    reply.raw.write("event: connected\ndata: Connection established\n\n");

    reply.raw.on("close", () => {
      console.log(`${clientId} Connection closed`);
      sseResponses.delete(clientId);
    });

    return reply;
  });

  (async () => {
    let c = 0;
    setInterval(() => {
      sseResponses.forEach((sseR) => {
        sseR.write(`: ${c++}\n\n`);
      });
    }, 2000);
  })();
};
