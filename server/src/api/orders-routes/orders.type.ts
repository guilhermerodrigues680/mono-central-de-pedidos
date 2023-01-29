import { Static, Type } from "@sinclair/typebox";

// https://www.fastify.io/docs/latest/Reference/TypeScript/#typebox

export const OrderForm = Type.Object({
  description: Type.String(),
});

export const OrderStatus = Type.Union([
  Type.Literal("CREATED"),
  Type.Literal("BEING_PREPARED"),
  Type.Literal("READY"),
  Type.Literal("DELIVERED"),
]);

export const Order = Type.Object({
  id: Type.String({ format: "uuid" }),
  description: Type.String(),
  status: OrderStatus,
});

export type OrderFormType = Static<typeof OrderForm>;
export type OrderStatusType = Static<typeof OrderStatus>;
export type OrderType = Static<typeof Order>;
