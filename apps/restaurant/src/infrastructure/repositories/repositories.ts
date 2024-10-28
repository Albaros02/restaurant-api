import { Provider } from "@nestjs/common";
import { OrderRepository } from "./order.repository.ts";
import { ClientRepository } from "./client.repository";
import { RestaurantRepository } from "./restaurant.repository";


export const RepositoryProviders : Provider[] = [
    {
        useClass: OrderRepository, 
        provide: "IOrderRepository"
    },
    {
        useClass: ClientRepository, 
        provide: "IClientRepository"
    },
    {
        useClass: RestaurantRepository, 
        provide: "IRestaurantRepository"
    }
] 