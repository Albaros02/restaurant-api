import { ClientEntity } from "apps/restaurant/src/domain/entities/client.entity";
import { UserPersistence } from "apps/restaurant/src/infrastructure/persistence/user.persistence";
import { IGenericRepository } from "libs/common/application/interfaces/igeneric-repository";

export interface IUserRepository extends IGenericRepository<ClientEntity,UserPersistence>{}