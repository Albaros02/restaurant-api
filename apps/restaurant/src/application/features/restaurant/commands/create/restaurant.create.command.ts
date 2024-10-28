import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { ILoggerService } from "apps/restaurant/src/application/services/ilogger.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { Result } from "libs/common/application/base";
import { CreateRestaurantDto } from "./restaurant.create.dto.command";
import { RestaurantEntity } from "apps/restaurant/src/domain/entities/restaurant.entity";
import { IRestaurantRepository } from "apps/restaurant/src/application/interfaces/reposoitories/irestaurant-repository";
import { RestaurantPersistence } from "apps/restaurant/src/infrastructure/persistence/restaurant.persistence";

export class CreateRestaurantCommand
{
    constructor(
        public readonly dto: CreateRestaurantDto
    ) {}
}

@CommandHandler(CreateRestaurantCommand)
export class CreateRestaurantCommandHandler implements ICommandHandler<CreateRestaurantCommand, Result<RestaurantEntity>>
{
    constructor(
        @Inject("IRestaurantRepository")
        private readonly restaurantRepository: IRestaurantRepository,
        @Inject("ILoggerService") 
        private readonly logger : ILoggerService,
        @InjectMapper() private readonly mapper: Mapper        
    ) {}
    async execute(command: CreateRestaurantCommand): Promise<Result<RestaurantEntity>> {
        this.logger.info(`Creating a new restaurant with name ${command.dto.name}.`)
        const restaurantResult = RestaurantEntity.create(command.dto); 
        if(restaurantResult.isFailure)
        {
            this.logger.error(`Error creating the restaurant.`)
            return restaurantResult; 
        }
        
        const restaurant = restaurantResult.unwrap();
        const saveResult = await this.restaurantRepository.saveNew(restaurant)
        const mapped = this.mapper.map(saveResult,RestaurantPersistence, RestaurantEntity);
        return Result.Ok(mapped); 
    }
}