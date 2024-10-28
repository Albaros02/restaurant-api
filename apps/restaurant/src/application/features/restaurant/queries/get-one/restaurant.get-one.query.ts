import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Result } from "libs/common/application/base";
import { ILoggerService } from "apps/restaurant/src/application/services/ilogger.service";
import { Inject } from "@nestjs/common";
import { AppError } from "libs/common/application/errors/app.errors";
import { GetOneRestaurantDto } from "./restaurant.get-one.dto";
import { IRestaurantRepository } from "apps/restaurant/src/application/interfaces/reposoitories/irestaurant-repository";
import { RestaurantEntity } from "apps/restaurant/src/domain/entities/restaurant.entity";

export class GetOneRestaurantQuery
{
    constructor(
        public dto: GetOneRestaurantDto, 
        public userId: string
    ) {}
}

@QueryHandler(GetOneRestaurantQuery)

export class GetOneRestaurantQueryHandler implements IQueryHandler<GetOneRestaurantQuery, Result<RestaurantEntity>>
{
    constructor(
        @Inject("ILoggerService")
        private readonly logger: ILoggerService, 
        @Inject("IRestaurantRepository")
        private readonly RestaurantRepository : IRestaurantRepository
    ) {}
    async execute(query: GetOneRestaurantQuery): Promise<Result<RestaurantEntity>> {
        const {userId, dto } = query;
        await this.logger.auditAsync(userId,`Trying to retrieve Restaurant ${dto.restaurantId}.`)
        const { restaurantId } = query.dto; 
        
        const Restaurant = await this.RestaurantRepository.findOneByFilter({
            where: {
                id: restaurantId
            }
        })
        if(!Restaurant)
        {
            this.logger.error(`Restaurant with name ${restaurantId} not found.`)  
            return Result.Fail(new AppError.NotFoundError(`Restaurant not found.`))
        }
        return Result.Ok(Restaurant)
    }   
}