import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { Result } from "libs/common/application/base";
import { CreateOrderDto } from "./order.create.dto.command";
import { OrderEntity } from "apps/restaurant/src/domain/entities/order.entity";
import { IOrderRepository } from "apps/restaurant/src/application/interfaces/reposoitories/iorder-repository";
import { ILoggerService } from "apps/restaurant/src/application/services/ilogger.service";
import { OrderPersistence } from "apps/restaurant/src/infrastructure/persistence/order.persistence";
import { IClientRepository } from "apps/restaurant/src/application/interfaces/reposoitories/iclient-repository";
import { IRestaurantRepository } from "apps/restaurant/src/application/interfaces/reposoitories/irestaurant-repository";
import { AppError } from "libs/common/application/errors/app.errors";

export class CreateOrderCommand
{
    constructor(
        public readonly dto: CreateOrderDto
    ) {}
}

@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler implements ICommandHandler<CreateOrderCommand, Result<OrderEntity>>
{
    constructor(
        @Inject("IOrderRepository")
        private readonly OrderRepository: IOrderRepository,
        @Inject("IClientRepository")
        private readonly clientRepository: IClientRepository,
        @Inject("IRestaurantRepository")
        private readonly restaurantRepository: IRestaurantRepository,
        @Inject("ILoggerService") 
        private readonly logger : ILoggerService,
        @InjectMapper() private readonly mapper: Mapper        
    ) {}
    async execute(command: CreateOrderCommand): Promise<Result<OrderEntity>> {
        this.logger.info(`Creating a new Order with name ${command.dto.description}.`)
        const { clientId, restaurantId } = command.dto; 
        const client = await this.clientRepository.findOneByFilter({
            where: {
                id: clientId
            }
        })
        if(!client)
        {
            this.logger.error(`Client with id ${clientId} not found.`)  
            return Result.Fail(new AppError.NotFoundError(`Client not found.`))
        }       
        const restaurant = await this.restaurantRepository.findOneByFilter({
            where: {
                id: restaurantId
            }
        })
        if(!restaurant)
        {
            this.logger.error(`Restaurant with name ${restaurantId} not found.`)  
            return Result.Fail(new AppError.NotFoundError(`Restaurant not found.`))
        }
        
        const orderResult = OrderEntity.create({
            client: client,
            restaurant: restaurant,
            description: command.dto.description,
        }); 

        if(orderResult.isFailure)
        {
            this.logger.error(`Error creating the Order.`)
            return orderResult; 
        }
        
        const Order = orderResult.unwrap();
        console.log({Order})
        const saveResult = await this.OrderRepository.saveNew(Order)
        console.log("Saved")
        const mapped = this.mapper.map(saveResult,OrderPersistence, OrderEntity);
        return Result.Ok(mapped); 
    }
}