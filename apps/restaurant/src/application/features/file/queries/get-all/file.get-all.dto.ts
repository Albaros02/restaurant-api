import { FilePersistence } from "apps/restaurant/src/infrastructure/persistence/file.persistence";
import { FindManyOptions } from "typeorm";

export class GetAllFilesDto implements FindManyOptions<FilePersistence> {}