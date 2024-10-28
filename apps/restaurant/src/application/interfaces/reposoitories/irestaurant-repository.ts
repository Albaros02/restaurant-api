import { RestaurantEntity } from "apps/restaurant/src/domain/entities/restaurant.entity";
import { RestaurantPersistence } from "apps/restaurant/src/infrastructure/persistence/restaurant.persistence";
import { IGenericRepository } from "libs/common/application/interfaces/igeneric-repository";

export interface IRestaurantRepository extends IGenericRepository<RestaurantEntity,RestaurantPersistence>
{
}