import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { Result } from "libs/common/application/base";
import { AppError } from "libs/common/application/errors/app.errors";
import { IOrderRepository } from "apps/restaurant/src/application/interfaces/reposoitories/iorder-repository";
import { ILoggerService } from "apps/restaurant/src/application/services/ilogger.service";

export class DeleteOrderCommand
{
    constructor(
        public performerId: string, 
        public OrderId: string
    ) {}
}

@CommandHandler(DeleteOrderCommand)
export class DeleteOrderCommandHandler implements ICommandHandler<DeleteOrderCommand, Result<void>>
{
    constructor(
        @Inject("IOrderRepository")
        private readonly OrderRepository: IOrderRepository,
        @Inject("ILoggerService") 
        private readonly logger : ILoggerService,
    ) {}
    async execute(command: DeleteOrderCommand): Promise<Result<void>> {
        const { OrderId, performerId } = command; 
        this.logger.info(`User with id ${performerId} is trying to delete Order with id ${performerId}.`)        
        
        const Order = await this.OrderRepository.findOneByFilter({
            where: {
                id: OrderId
            }
        })
        if(!Order)
        {
            this.logger.error(`Order with id ${OrderId} not found.`)  
            return Result.Fail(new AppError.NotFoundError(`Order not found.`))
        }        
        const ans = await this.OrderRepository.delete(OrderId);  
        if(ans.isFailure)
        {
            this.logger.error(`Error deleting the Order.`)
            return ans; 
        }
        return ans;
   }
}