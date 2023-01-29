import { Static, Type } from "@sinclair/typebox";

// https://www.fastify.io/docs/latest/Reference/TypeScript/#typebox

export const OrderFormSchema = Type.Object({
  description: Type.String(),
});

export const OrderStatusSchema = Type.Union([
  Type.Literal("CREATED"),
  Type.Literal("BEING_PREPARED"),
  Type.Literal("READY"),
  Type.Literal("DELIVERED"),
]);

export const OrderSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  description: Type.String(),
  status: OrderStatusSchema,
});

export type OrderForm = Static<typeof OrderFormSchema>;
export type OrderStatus = Static<typeof OrderStatusSchema>;
export type Order = Static<typeof OrderSchema>;
