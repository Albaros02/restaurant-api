import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Result } from "libs/common/application/base";
import { Inject } from "@nestjs/common";
import { FindManyOptions } from "typeorm";
import { PaginationDto } from "libs/common/presentation/dtos/pagination.dto";
import { PaginatedFindResult } from "libs/common/application/base/pagination.result";
import { OrderPersistence } from "apps/restaurant/src/infrastructure/persistence/order.persistence";
import { ILoggerService } from "apps/restaurant/src/application/services/ilogger.service";
import { IOrderRepository } from "apps/restaurant/src/application/interfaces/reposoitories/iorder-repository";
import { OrderEntity } from "apps/restaurant/src/domain/entities/order.entity";

export class GetAllOrderQuery {
    constructor(
        public readonly performerId: string,
        public readonly filter: FindManyOptions<OrderPersistence>, 
        public readonly pagination: PaginationDto 
    ) {}
}

@QueryHandler(GetAllOrderQuery)
export class GetAllOrderQueryHandler implements IQueryHandler<GetAllOrderQuery, Result<PaginatedFindResult<OrderEntity>>> {
    constructor(
        @Inject("ILoggerService")
        private readonly logger: ILoggerService,
        @Inject("IOrderRepository")
        private readonly OrderRepository: IOrderRepository
    ) {}

    async execute(query: GetAllOrderQuery): Promise<Result<PaginatedFindResult<OrderEntity>>> {
        const { performerId: userId, filter, pagination } = query;

        this.logger.info(`User with id ${userId} is trying to retrieve all Orders.`);
        const Orders = await this.OrderRepository.findAllPaginated(pagination, {
            where: filter.where
        });

        return Result.Ok(Orders);
    }
}
