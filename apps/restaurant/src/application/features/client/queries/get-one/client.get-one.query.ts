import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Result } from "libs/common/application/base";
import { ILoggerService } from "apps/restaurant/src/application/services/ilogger.service";
import { Inject } from "@nestjs/common";
import { AppError } from "libs/common/application/errors/app.errors";
import { GetOneClientDto } from "./client.get-one.dto";
import { ClientEntity } from "apps/restaurant/src/domain/entities/client.entity";
import { IClientRepository } from "apps/restaurant/src/application/interfaces/reposoitories/iclient-repository";

export class GetOneClientQuery
{
    constructor(
        public dto: GetOneClientDto, 
        public userId: string
    ) {}
}

@QueryHandler(GetOneClientQuery)
export class GetOneClientQueryHandler implements IQueryHandler<GetOneClientQuery, Result<ClientEntity>>
{
    constructor(
        @Inject("ILoggerService")
        private readonly logger: ILoggerService, 
        @Inject("IClientRepository")
        private readonly clientRepository : IClientRepository
    ) {}
    async execute(query: GetOneClientQuery): Promise<Result<ClientEntity>> {
        const {userId, dto } = query;
        await this.logger.auditAsync(userId,`Trying to retrieve client ${dto.clientId}.`)
        const { clientId } = query.dto; 
        
        const client = await this.clientRepository.findOneByFilter({
            where: {
                id: clientId
            }
        })
        if(!client)
        {
            this.logger.error(`Client with name ${clientId} not found.`)  
            return Result.Fail(new AppError.NotFoundError(`Client not found.`))
        }
        return Result.Ok(client)
    }   
}