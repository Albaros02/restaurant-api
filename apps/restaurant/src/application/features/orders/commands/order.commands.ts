import { CreateOrderCommandHandler } from "./create/order.create.command";
import { DeleteOrderCommandHandler } from "./delete/order.delete.command";

export const OrderCommandHandlers = [
    CreateOrderCommandHandler, 
    DeleteOrderCommandHandler
]