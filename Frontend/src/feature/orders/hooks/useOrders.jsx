import { useContext } from "react";
import { OrdersContext } from "../orders.context";

export function useOrders() {
  return useContext(OrdersContext);
}
