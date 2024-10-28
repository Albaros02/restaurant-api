import { ClientPersistence } from "./client.persistence";
import { OrderPersistence } from "./order.persistence";
import { RestaurantPersistence } from "./restaurant.persistence";

export const PersistenceEntities = [
    ClientPersistence,
    RestaurantPersistence,
    OrderPersistence
]