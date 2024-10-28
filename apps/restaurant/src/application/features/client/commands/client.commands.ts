import { CreateClientCommandHandler } from "./create/client.create.command";
import { DeleteClientCommandHandler } from "./delete/client.delete.command";
import { ReserveRestaurantCommandHandler } from "./reserve/client.reserve.command";

export const ClientCommandHandlers = [
    CreateClientCommandHandler, 
    DeleteClientCommandHandler,
    ReserveRestaurantCommandHandler
]