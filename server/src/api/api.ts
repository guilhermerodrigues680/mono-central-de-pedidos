import cors from "@fastify/cors";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify, { type FastifyInstance } from "fastify";
import { OrdersService } from "../services/orders-service.type";
import { ordersRoutes } from "./orders-routes";

const fastify: FastifyInstance = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

fastify.register(cors, {
  origin: "*",
  methods: ["OPTIONS", "GET", "POST", "PUT"],
});

function configureApiRoutes(ordersService: OrdersService) {
  fastify.register(ordersRoutes, { prefix: "/api", ordersService });
}

export { fastify, configureApiRoutes };
