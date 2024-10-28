import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Result } from "libs/common/application/base";
import { ILoggerService } from "apps/restaurant/src/application/services/ilogger.service";
import { Inject } from "@nestjs/common";
import { FindManyOptions } from "typeorm";
import { PaginationDto } from "libs/common/presentation/dtos/pagination.dto";
import { PaginatedFindResult } from "libs/common/application/base/pagination.result";
import { ClientPersistence } from "apps/restaurant/src/infrastructure/persistence/client.persistence";
import { IClientRepository } from "apps/restaurant/src/application/interfaces/reposoitories/iclient-repository";
import { ClientEntity } from "apps/restaurant/src/domain/entities/client.entity";

export class GetAllClientQuery {
    constructor(
        public readonly performerId: string,
        public readonly filter: FindManyOptions<ClientPersistence>, 
        public readonly pagination: PaginationDto 
    ) {}
}

@QueryHandler(GetAllClientQuery)
export class GetAllClientQueryHandler implements IQueryHandler<GetAllClientQuery, Result<PaginatedFindResult<ClientEntity>>> {
    constructor(
        @Inject("ILoggerService")
        private readonly logger: ILoggerService,
        @Inject("IClientRepository")
        private readonly clientRepository: IClientRepository
    ) {}

    async execute(query: GetAllClientQuery): Promise<Result<PaginatedFindResult<ClientEntity>>> {
        const { performerId: userId, filter, pagination } = query;

        this.logger.info(`User with id ${userId} is trying to retrieve all clients.`);
        const clients = await this.clientRepository.findAllPaginated(pagination, {
            where: filter.where
        });

        return Result.Ok(clients);
    }
}
