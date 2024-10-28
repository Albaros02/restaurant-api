import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "libs/common/presentation/dtos/pagination.dto";
import { PaginatedFindResult } from "libs/common/application/base/pagination.result";
import { RestaurantPersistence } from "../persistence/restaurant.persistence";
import { RestaurantEntity } from "../../domain/entities/restaurant.entity";

@Injectable()
export class RestaurantRepository {

    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        @InjectRepository(RestaurantPersistence)
        private readonly repository: Repository<RestaurantPersistence>
    ) {
    }

    /**
     * Save a new Restaurant entity
     */
    async saveNew(restaurant: RestaurantEntity): Promise<RestaurantPersistence> {
        const restaurantPersistence = this.mapper.map(restaurant, RestaurantEntity, RestaurantPersistence);
        return await this.repository.save(restaurantPersistence);
    }

    /**
     * Update a Restaurant entity by filter options
     */
    async update(id:string, entity: Partial<RestaurantEntity>): Promise<any> {
        const restaurantPersistence = await this.repository.findOne({ where: { id } });
        
        if (!restaurantPersistence) {
            return undefined;
        }
        
        const updatedEntity = this.mapper.map(entity, RestaurantEntity, RestaurantPersistence);
        await this.repository.update(id, updatedEntity);
        
        return updatedEntity;
    }

    /**
     * Delete a Restaurant by id
     */
    async delete(id: string): Promise<any> {
        const RestaurantPersistence = await this.repository.findOne({ where: { id } });
        
        if (!RestaurantPersistence) {
            return undefined;
        }
        
        await this.repository.delete(id);
        return { deleted: true };
    }

    /**
     * Find one Restaurant by filter options
     */
    async findOneByFilter(options?: FindOneOptions<RestaurantPersistence>): Promise<RestaurantEntity | undefined> {
        const restaurantPersistence = await this.repository.findOne(options);
        
        if (!restaurantPersistence) {
            return undefined;
        }
        
        return this.mapper.map(restaurantPersistence, RestaurantPersistence, RestaurantEntity);
    }

    /**
     * Find all Restaurants based on provided options
     */
    async findAll(options?: FindManyOptions<RestaurantPersistence>): Promise<RestaurantEntity[]> {
        const Restaurants = await this.repository.find(options);
        return Restaurants.map(Restaurant => this.mapper.map(Restaurant, RestaurantPersistence, RestaurantEntity));
    }

    /**
     * Find a Restaurant by id
     */
    async findById(id: string): Promise<RestaurantEntity | undefined> {
        const restaurantPersistence = await this.repository.findOne({ where: { id } });
        
        if (!restaurantPersistence) {
            return undefined;
        }
        
        return this.mapper.map(restaurantPersistence, RestaurantPersistence, RestaurantEntity);
    }
    
    async findAllPaginated(pagination: PaginationDto, options?: FindManyOptions<RestaurantPersistence>): Promise<PaginatedFindResult<RestaurantEntity>> {
        const [results, total] = await this.repository.findAndCount({
            ...options,
            skip: (pagination.page - 1) * pagination.limit,
            take: pagination.limit,
        });

        const items = results.map(Restaurant => this.mapper.map(Restaurant, RestaurantPersistence, RestaurantEntity));

        return {
            items,
            limit: pagination.limit,
            currentPage: pagination.page,
            totalPages: Math.ceil(total / pagination.limit), 
        };
    } 
}
