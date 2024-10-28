import { FileEntity } from "apps/restaurant/src/domain/entities/file.entity";
import { FilePersistence } from "apps/restaurant/src/infrastructure/persistence/file.persistence";
import { IGenericRepository } from "libs/common/application/interfaces/igeneric-repository";

export interface IFileRepository extends IGenericRepository<FileEntity,FilePersistence>{}