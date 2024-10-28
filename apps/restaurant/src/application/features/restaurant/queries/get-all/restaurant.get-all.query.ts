import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Result } from "libs/common/application/base";
import { ILoggerService } from "apps/restaurant/src/application/services/ilogger.service";
import { Inject } from "@nestjs/common";
import { FindManyOptions } from "typeorm";
import { PaginationDto } from "libs/common/presentation/dtos/pagination.dto";
import { PaginatedFindResult } from "libs/common/application/base/pagination.result";
import { RestaurantPersistence } from "apps/restaurant/src/infrastructure/persistence/restaurant.persistence";
import { IRestaurantRepository } from "apps/restaurant/src/application/interfaces/reposoitories/irestaurant-repository";
import { RestaurantEntity } from "apps/restaurant/src/domain/entities/restaurant.entity";

export class GetAllRestaurantQuery {
    constructor(
        public readonly performerId: string,
        public readonly filter: FindManyOptions<RestaurantPersistence>, 
        public readonly pagination: PaginationDto 
    ) {}
}

@QueryHandler(GetAllRestaurantQuery)
export class GetAllRestaurantQueryHandler implements IQueryHandler<GetAllRestaurantQuery, Result<PaginatedFindResult<RestaurantEntity>>> {
    constructor(
        @Inject("ILoggerService")
        private readonly logger: ILoggerService,
        @Inject("IRestaurantRepository")
        private readonly RestaurantRepository: IRestaurantRepository
    ) {}

    async execute(query: GetAllRestaurantQuery): Promise<Result<PaginatedFindResult<RestaurantEntity>>> {
        const { performerId: userId, filter, pagination } = query;

        this.logger.info(`User with id ${userId} is trying to retrieve all Restaurants.`);
        const Restaurants = await this.RestaurantRepository.findAllPaginated(pagination, {
            where: filter.where
        });

        return Result.Ok(Restaurants);
    }
}
