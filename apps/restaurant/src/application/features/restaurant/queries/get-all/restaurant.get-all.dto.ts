import { RestaurantPersistence } from "apps/restaurant/src/infrastructure/persistence/restaurant.persistence";
import { FindManyOptions } from "typeorm";

export class GetAllRestaurantsDto implements FindManyOptions<RestaurantPersistence> {}