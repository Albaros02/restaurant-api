import { CreateClientCommandHandler } from "./create/client.create.command";
import { DeleteClientCommandHandler } from "./delete/client.delete.command";

export const ClientCommandHandlers = [
    CreateClientCommandHandler, 
    DeleteClientCommandHandler
]