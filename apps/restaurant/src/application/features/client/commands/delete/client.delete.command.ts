import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { ILoggerService } from "apps/restaurant/src/application/services/ilogger.service";
import { Result } from "libs/common/application/base";
import { AppError } from "libs/common/application/errors/app.errors";
import { IClientRepository } from "apps/restaurant/src/application/interfaces/reposoitories/iclient-repository";

export class DeleteClientCommand
{
    constructor(
        public performerId: string, 
        public clientId: string
    ) {}
}

@CommandHandler(DeleteClientCommand)
export class DeleteClientCommandHandler implements ICommandHandler<DeleteClientCommand, Result<void>>
{
    constructor(
        @Inject("IClientRepository")
        private readonly clientRepository: IClientRepository,
        @Inject("ILoggerService") 
        private readonly logger : ILoggerService,
    ) {}
    async execute(command: DeleteClientCommand): Promise<Result<void>> {
        const { clientId, performerId } = command; 
        this.logger.info(`User with id ${performerId} is trying to delete client with id ${performerId}.`)        
        
        const client = await this.clientRepository.findOneByFilter({
            where: {
                id: clientId
            }
        })
        if(!client)
        {
            this.logger.error(`Client with id ${clientId} not found.`)  
            return Result.Fail(new AppError.NotFoundError(`Client not found.`))
        }        
        const ans = await this.clientRepository.delete(clientId);  
        if(ans.isFailure)
        {
            this.logger.error(`Error deleting the client.`)
            return ans; 
        }
        return ans;
   }
}