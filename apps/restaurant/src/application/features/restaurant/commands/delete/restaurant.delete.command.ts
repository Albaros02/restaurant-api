import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { ILoggerService } from "apps/restaurant/src/application/services/ilogger.service";
import { Result } from "libs/common/application/base";
import { AppError } from "libs/common/application/errors/app.errors";
import { IRestaurantRepository } from "apps/restaurant/src/application/interfaces/reposoitories/irestaurant-repository";

export class DeleteRestaurantCommand
{
    constructor(
        public performerId: string, 
        public RestaurantId: string
    ) {}
}

@CommandHandler(DeleteRestaurantCommand)
export class DeleteRestaurantCommandHandler implements ICommandHandler<DeleteRestaurantCommand, Result<void>>
{
    constructor(
        @Inject("IRestaurantRepository")
        private readonly restaurantRepository: IRestaurantRepository,
        @Inject("ILoggerService") 
        private readonly logger : ILoggerService,
    ) {}
    async execute(command: DeleteRestaurantCommand): Promise<Result<void>> {
        const { RestaurantId, performerId } = command; 
        this.logger.info(`User with id ${performerId} is trying to delete Restaurant with id ${performerId}.`)        
        
        const Restaurant = await this.restaurantRepository.findOneByFilter({
            where: {
                id: RestaurantId
            }
        })
        if(!Restaurant)
        {
            this.logger.error(`Restaurant with id ${RestaurantId} not found.`)  
            return Result.Fail(new AppError.NotFoundError(`Restaurant not found.`))
        }        
        const ans = await this.restaurantRepository.delete(RestaurantId);  
        if(ans.isFailure)
        {
            this.logger.error(`Error deleting the Restaurant.`)
            return ans; 
        }
        return ans;
   }
}