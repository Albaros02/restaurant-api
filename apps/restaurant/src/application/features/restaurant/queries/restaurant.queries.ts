import { GetAllRestaurantQueryHandler } from "./get-all/restaurant.get-all.query";
import { GetOneRestaurantQueryHandler } from "./get-one/restaurant.get-one.query";

export const RestaurantQueries = [
    GetOneRestaurantQueryHandler,
    GetAllRestaurantQueryHandler,
]