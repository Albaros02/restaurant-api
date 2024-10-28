import { GetAllClientQueryHandler } from "./get-all/client.get-all.query";
import { GetOneClientQueryHandler } from "./get-one/client.get-one.query";

export const ClientQueries = [
    GetOneClientQueryHandler,
    GetAllClientQueryHandler,
]