import cors from "@fastify/cors";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify, { type FastifyInstance } from "fastify";
import { ordersRoutes } from "./orders-route";

const fastify: FastifyInstance = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

fastify.register(cors, {
  origin: "*",
  methods: ["OPTIONS", "GET", "POST", "PUT"],
});

fastify.register(ordersRoutes, { prefix: "/api" });

export { fastify };
