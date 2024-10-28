import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { ILoggerService } from "apps/restaurant/src/application/services/ilogger.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { Result } from "libs/common/application/base";
import { IClientRepository } from "apps/restaurant/src/application/interfaces/reposoitories/iclient-repository";
import { ReserveRestaurantDto } from "./client.reserve.dto.command";
import { IRestaurantRepository } from "apps/restaurant/src/application/interfaces/reposoitories/irestaurant-repository";
import { AppError } from "libs/common/application/errors/app.errors";

export class ReserveRestaurantCommand
{
    constructor(
        public readonly dto: ReserveRestaurantDto
    ) {}
}

@CommandHandler(ReserveRestaurantCommand)
export class ReserveRestaurantCommandHandler implements ICommandHandler<ReserveRestaurantCommand, Result<any>>
{
    constructor(
        @Inject("IClientRepository")
        private readonly clientRepository: IClientRepository,
        @Inject("IRestaurantRepository")
        private readonly restaurantRepository: IRestaurantRepository,
        @Inject("ILoggerService") 
        private readonly logger : ILoggerService,
        @InjectMapper() private readonly mapper: Mapper        
    ) {}
    async execute(command: ReserveRestaurantCommand): Promise<Result<any>> {
        this.logger.info(`Client with id ${command.dto.clientId} is reserving in restaurant ${command.dto.restaurantId}.`)

        const restaurant = await this.restaurantRepository.findById(command.dto.restaurantId); 
        if(!restaurant)
        {
            
            this.logger.error(`Restaurant not found.`)
            return Result.Fail(new AppError.NotFoundError(`Restaurant with id ${command.dto.restaurantId} not found.`)); 
        } 

        const client = await this.clientRepository.findOneByFilter({
            where: {
                id: command.dto.clientId
            }
        })
        if(!client)
        {
            this.logger.error(`Client with id ${command.dto.clientId} not found.`)  
            return Result.Fail(new AppError.NotFoundError(`Client not found.`))
        }

        const reserveResult = restaurant.reserve([client]);
        if(reserveResult.isFailure)
        {
            return reserveResult;   
        } 
        
        const updateResult = await this.restaurantRepository.saveNew(restaurant); 

        return Result.Ok();  
    }
}