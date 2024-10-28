import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { ILoggerService } from "apps/restaurant/src/application/services/ilogger.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { Result } from "libs/common/application/base";
import { CreateClientDto } from "./client.create.dto.command";
import { IClientRepository } from "apps/restaurant/src/application/interfaces/reposoitories/iclient-repository";
import { ClientEntity } from "apps/restaurant/src/domain/entities/client.entity";
import { ClientPersistence } from "apps/restaurant/src/infrastructure/persistence/client.persistence";

export class CreateClientCommand
{
    constructor(
        public readonly dto: CreateClientDto
    ) {}
}

@CommandHandler(CreateClientCommand)
export class CreateClientCommandHandler implements ICommandHandler<CreateClientCommand, Result<ClientEntity>>
{
    constructor(
        @Inject("IClientRepository")
        private readonly clientRepository: IClientRepository,
        @Inject("ILoggerService") 
        private readonly logger : ILoggerService,
        @InjectMapper() private readonly mapper: Mapper        
    ) {}
    async execute(command: CreateClientCommand): Promise<Result<ClientEntity>> {
        this.logger.info(`Creating a new user with email ${command.dto.email}.`)
        const clientResult = ClientEntity.create(command.dto); 
        if(clientResult.isFailure)
        {
            this.logger.error(`Error creating the user.`)
            return clientResult; 
        }
        
        const client = clientResult.unwrap();
        const saveResult = await this.clientRepository.saveNew(client)
        const mapped = this.mapper.map(saveResult,ClientPersistence, ClientEntity);
        return Result.Ok(mapped); 
    }
}