import { AuditLogEntity } from "apps/restaurant/src/domain/entities/aduit-log.entity";
import { AuditLogPersistence } from "apps/restaurant/src/infrastructure/persistence/aduit-log.persistence";
import { IGenericRepository } from "libs/common/application/interfaces/igeneric-repository";

export interface IAuditLogRepository extends IGenericRepository<AuditLogEntity,AuditLogPersistence>{}