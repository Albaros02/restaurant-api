import { AutoMap } from "@automapper/classes";
import { BaseDomainEntity } from "libs/common/domain/base-domain.entity";
import { ClientEntity } from "./client.entity";
import { Result } from "libs/common/application/base";
import { AppError } from "libs/common/application/errors/app.errors";

export class RestaurantEntityProps
{
    @AutoMap()
    public name: string

    @AutoMap()
    public address: string

    @AutoMap()
    public capacity: number

    @AutoMap()
    public clients?: ClientEntity[]
}
 
export class RestaurantEntity extends BaseDomainEntity 
{
    private constructor(props: RestaurantEntityProps) {
        super();
        this.props = props;
    }
    
    public props : RestaurantEntityProps 

    static create(props: RestaurantEntityProps): Result<RestaurantEntity>{        
        return Result.Ok(new RestaurantEntity(props)); 
    }

    public reserve(newClients: ClientEntity[]) : Result<void>
    {
        if(this.props.clients?.length ?? 0 + newClients.length > this.props.capacity)
        {
            return Result.Fail(new AppError.ValidationError(`Reservation failed due to restaurant capacity.`))
        }
        return Result.Ok(); 
    }
}