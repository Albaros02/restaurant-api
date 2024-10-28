import { Inject, Injectable, Logger } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";

export interface ILoggerService 
{
    info(message: string | any); 
    error(message: string | any); 
    warn(message: string | any); 
    auditAsync(userId: string,message: string | any); 
}

@Injectable()
export class LoggerService extends Logger implements ILoggerService
{
    constructor(
        private readonly eventBus: EventBus
    ) {
        super("FileGateWay");
    }
    
    async auditAsync(userId: string, message: string | any) {
        
        //TODO:  Basic implementation for now, later maybe extend it with Seq or other external logging service 
        // await this.eventBus.publish(new AuditLogCreatedEvent(userId,message))
        return this.info(message); 
    }

    info(message: string | any) {
        return this.log(message); 
    }
}
