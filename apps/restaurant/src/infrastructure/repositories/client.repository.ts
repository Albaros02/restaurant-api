import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientEntity } from "../../domain/entities/client.entity";
import { PaginationDto } from "libs/common/presentation/dtos/pagination.dto";
import { PaginatedFindResult } from "libs/common/application/base/pagination.result";
import { ClientPersistence } from "../persistence/client.persistence";

@Injectable()
export class ClientRepository {

    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        @InjectRepository(ClientPersistence)
        private readonly repository: Repository<ClientPersistence>
    ) {
    }

    /**
     * Save a new Client entity
     */
    async saveNew(client: ClientEntity): Promise<ClientPersistence> {
        const clientPersistence = this.mapper.map(client, ClientEntity, ClientPersistence);
        return await this.repository.save(clientPersistence);
    }

    /**
     * Update a Client entity by filter options
     */
    async update(id:string, entity: Partial<ClientEntity>): Promise<any> {
        const clientPersistence = await this.repository.findOne({ where: { id } });
        
        if (!clientPersistence) {
            return undefined;
        }
        
        const updatedEntity = this.mapper.map(entity, ClientEntity, ClientPersistence);
        await this.repository.update(id, updatedEntity);
        
        return updatedEntity;
    }

    /**
     * Delete a Client by id
     */
    async delete(id: string): Promise<any> {
        const ClientPersistence = await this.repository.findOne({ where: { id } });
        
        if (!ClientPersistence) {
            return undefined;
        }
        
        await this.repository.delete(id);
        return { deleted: true };
    }

    /**
     * Find one Client by filter options
     */
    async findOneByFilter(options?: FindOneOptions<ClientPersistence>): Promise<ClientEntity | undefined> {
        const clientPersistence = await this.repository.findOne(options);
        
        if (!clientPersistence) {
            return undefined;
        }
        
        return this.mapper.map(clientPersistence, ClientPersistence, ClientEntity);
    }

    /**
     * Find all Clients based on provided options
     */
    async findAll(options?: FindManyOptions<ClientPersistence>): Promise<ClientEntity[]> {
        const Clients = await this.repository.find(options);
        return Clients.map(Client => this.mapper.map(Client, ClientPersistence, ClientEntity));
    }

    /**
     * Find a Client by id
     */
    async findById(id: string): Promise<ClientEntity | undefined> {
        const clientPersistence = await this.repository.findOne({ where: { id } });
        
        if (!clientPersistence) {
            return undefined;
        }
        
        return this.mapper.map(clientPersistence, ClientPersistence, ClientEntity);
    }
    
    async findAllPaginated(pagination: PaginationDto, options?: FindManyOptions<ClientPersistence>): Promise<PaginatedFindResult<ClientEntity>> {
        const [results, total] = await this.repository.findAndCount({
            ...options,
            skip: (pagination.page - 1) * pagination.limit,
            take: pagination.limit,
        });

        const items = results.map(Client => this.mapper.map(Client, ClientPersistence, ClientEntity));

        return {
            items,
            limit: pagination.limit,
            currentPage: pagination.page,
            totalPages: Math.ceil(total / pagination.limit), 
        };
    } 
}
