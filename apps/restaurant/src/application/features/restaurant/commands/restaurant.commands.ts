import { CreateRestaurantCommandHandler } from "./create/restaurant.create.command";
import { DeleteRestaurantCommandHandler } from "./delete/restaurant.delete.command";

export const RestaurantCommandHandlers = [
    CreateRestaurantCommandHandler, 
    DeleteRestaurantCommandHandler
]