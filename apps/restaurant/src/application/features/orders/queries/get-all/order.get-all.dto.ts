import { RestaurantPersistence } from "apps/restaurant/src/infrastructure/persistence/Restaurant.persistence";
import { FindManyOptions } from "typeorm";

export class GetAllOrderDto implements FindManyOptions<RestaurantPersistence> {}