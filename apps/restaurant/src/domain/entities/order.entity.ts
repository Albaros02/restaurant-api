import { AutoMap } from "@automapper/classes";
import { BaseDomainEntity } from "libs/common/domain/base-domain.entity";
import { ClientEntity } from "./client.entity";
import { Result } from "libs/common/application/base";
import { RestaurantEntity } from "./restaurant.entity";

export class OrderEntityProps
{
    @AutoMap()
    public description: string

    @AutoMap()
    public client: ClientEntity | { id: string }

    @AutoMap()
    public restaurant: RestaurantEntity | { id: string }
}
 
export class OrderEntity extends BaseDomainEntity 
{
    public constructor(props: OrderEntityProps) {
        super();
        this.props = props;
    }
    
    public props : OrderEntityProps 

    static create(props: OrderEntityProps): Result<OrderEntity>{        
        return Result.Ok(new OrderEntity(props)); 
    }
}