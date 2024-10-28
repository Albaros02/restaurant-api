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
        @Inject("ILoggerService") 
        private readonly logger : ILoggerService,
        @InjectMapper() private readonly mapper: Mapper        
    ) {}
    async execute(command: CreateOrderCommand): Promise<Result<OrderEntity>> {
        this.logger.info(`Creating a new Order with name ${command.dto.description}.`)
        const orderResult = OrderEntity.create({
            client: {id: command.dto.clientId},
            restaurant: { id: command.dto.restaurantId},
            description: command.dto.description,
        }); 
        if(orderResult.isFailure)
        {
            this.logger.error(`Error creating the Order.`)
            return orderResult; 
        }
        
        const Order = orderResult.unwrap();
        const saveResult = await this.OrderRepository.saveNew(Order)
        const mapped = this.mapper.map(saveResult,OrderPersistence, OrderEntity);
        return Result.Ok(mapped); 
    }
}