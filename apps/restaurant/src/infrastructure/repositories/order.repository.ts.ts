import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "libs/common/presentation/dtos/pagination.dto";
import { PaginatedFindResult } from "libs/common/application/base/pagination.result";
import { OrderPersistence } from "../persistence/order.persistence";
import { OrderEntity } from "../../domain/entities/order.entity";

@Injectable()
export class OrderRepository {

    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        @InjectRepository(OrderPersistence)
        private readonly repository: Repository<OrderPersistence>
    ) {
    }

    /**
     * Save a new Order entity
     */
    async saveNew(Order: OrderEntity): Promise<OrderPersistence> {
        const orderPersistence = this.mapper.map(Order, OrderEntity, OrderPersistence);
        return await this.repository.save(orderPersistence);
    }

    /**
     * Update a Order entity by filter options
     */
    async update(id:string, entity: Partial<OrderEntity>): Promise<any> {
        const orderPersistence = await this.repository.findOne({ where: { id } });
        
        if (!orderPersistence) {
            return undefined;
        }
        
        const updatedEntity = this.mapper.map(entity, OrderEntity, OrderPersistence);
        await this.repository.update(id, updatedEntity);
        
        return updatedEntity;
    }

    /**
     * Delete a Order by id
     */
    async delete(id: string): Promise<any> {
        const OrderPersistence = await this.repository.findOne({ where: { id } });
        
        if (!OrderPersistence) {
            return undefined;
        }
        
        await this.repository.delete(id);
        return { deleted: true };
    }

    /**
     * Find one Order by filter options
     */
    async findOneByFilter(options?: FindOneOptions<OrderPersistence>): Promise<OrderEntity | undefined> {
        const orderPersistence = await this.repository.findOne(options);
        
        if (!orderPersistence) {
            return undefined;
        }
        
        return this.mapper.map(orderPersistence, OrderPersistence, OrderEntity);
    }

    /**
     * Find all Orders based on provided options
     */
    async findAll(options?: FindManyOptions<OrderPersistence>): Promise<OrderEntity[]> {
        const Orders = await this.repository.find(options);
        return Orders.map(Order => this.mapper.map(Order, OrderPersistence, OrderEntity));
    }

    /**
     * Find a Order by id
     */
    async findById(id: string): Promise<OrderEntity | undefined> {
        const orderPersistence = await this.repository.findOne({ where: { id } });
        
        if (!orderPersistence) {
            return undefined;
        }
        
        return this.mapper.map(orderPersistence, OrderPersistence, OrderEntity);
    }
    
    async findAllPaginated(pagination: PaginationDto, options?: FindManyOptions<OrderPersistence>): Promise<PaginatedFindResult<OrderEntity>> {
        const [results, total] = await this.repository.findAndCount({
            ...options,
            skip: (pagination.page - 1) * pagination.limit,
            take: pagination.limit,
        });

        const items = results.map(Order => this.mapper.map(Order, OrderPersistence, OrderEntity));

        return {
            items,
            limit: pagination.limit,
            currentPage: pagination.page,
            totalPages: Math.ceil(total / pagination.limit), 
        };
    } 
}
