import { ClientPersistence } from "apps/restaurant/src/infrastructure/persistence/client.persistence";
import { FindManyOptions } from "typeorm";

export class GetAllClientsDto implements FindManyOptions<ClientPersistence> {}