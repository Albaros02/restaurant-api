import { ClientEntity } from "apps/restaurant/src/domain/entities/client.entity";
import { ClientPersistence } from "apps/restaurant/src/infrastructure/persistence/client.persistence";
import { IGenericRepository } from "libs/common/application/interfaces/igeneric-repository";

export interface IClientRepository extends IGenericRepository<ClientEntity,ClientPersistence>{}