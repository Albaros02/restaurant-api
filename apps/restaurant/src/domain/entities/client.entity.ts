import { AutoMap } from "@automapper/classes";
import { BaseDomainEntity } from "libs/common/domain/base-domain.entity";
import { AgeLimitAllowance } from "../constants/age-limit-allowance.constants";
import { Result } from "libs/common/application/base";
import { AppError } from "libs/common/application/errors/app.errors";

export class ClientEntityProps
{
    @AutoMap()
    public name: string

    @AutoMap()
    public email: string

    @AutoMap()
    public phone: string

    @AutoMap()
    public age: number
}
 
export class ClientEntity extends BaseDomainEntity 
{
    constructor(props: ClientEntityProps) {
        super();
        this.props = props;
    }
    
    public props : ClientEntityProps 

    static create(props: ClientEntityProps): Result<ClientEntity>{
        
        if(props.age < AgeLimitAllowance)
        {
            return Result.Fail(new AppError.ValidationError(`The user's age is not allowed, must be greater or equal to ${AgeLimitAllowance}.`))
        }
        return Result.Ok(new ClientEntity(props)); 
    } 
}