import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import type http from "node:http";
import { v4 as uuidv4 } from "uuid";
import cors from "@fastify/cors";
import { promisify } from "util";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Order, OrderForm, OrderType } from "./api.types";

const delay = promisify(setTimeout);

const server: FastifyInstance = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

const opts: RouteShorthandOptions = {
  schema: {
    // request needs to have a querystring with a `name` parameter
    querystring: {
      name: { type: "string" },
    },

    response: {
      200: {
        type: "object",
        properties: {
          pong: {
            type: "string",
          },
        },
      },
    },
  },
};

// Map para armazenar as referências aos responses SSE
const sseResponses = new Map<
  string,
  http.ServerResponse<http.IncomingMessage>
>();

// Map para armazenar os pedidos
const orders = new Map<string, OrderType>();

server.register(cors, {
  origin: "*",
  methods: ["OPTIONS", "GET", "POST", "PUT"],
});

server.get("/ping", opts, async (request, reply) => {
  //   const fs = require("fs");
  //   const stream = fs.createReadStream("some-file", "utf8");
  //   reply.header("Content-Type", "application/octet-stream");
  //   return reply.send(stream);
  //   return { pong: "it worked!" };
  // fs.readFile("some-file", (err, fileBuffer) => {
  //   reply.send(err || fileBuffer);
  // });
  // return reply;
});

server.get("/orders", {}, async (request, reply) => {
  return reply;
});

server.post<{ Body: OrderType; Reply: OrderType }>(
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

    // Enviando o evento de novo pedido aos clientes SSE
    sseResponses.forEach((sseR) => {
      sseR.write(
        `event: new-order\ndata: ${JSON.stringify(order)}\n\n`,
        (err) => {
          console.debug("sseR.write callback", err);
        }
      );
    });

    return reply
      .code(201)
      .header("Location", `/orders/${order.id}`)
      .send(order);
  }
);

server.get("/sse/orders-stream", async (request, reply) => {
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

export { server };
