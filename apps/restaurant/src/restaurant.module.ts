import { Module } from '@nestjs/common';
import { RestaurantControllers } from './presentation/controllers/controllers';
import { CommonModule } from 'libs/common';
import { ApplicationServices } from './application/services/application.services';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersistenceEntities } from './infrastructure/persistence/persistence';
import { RepositoryProviders } from './infrastructure/repositories/repositories';
import { EnvVarsAccessor } from 'libs/common/configs/env-vars-accessor';
import { config } from 'dotenv';
import { ClientCommandHandlers } from './application/features/client/commands/client.commands';
import { ClientQueries } from './application/features/client/queries/client.queries';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { DbSeeder } from './infrastructure/seed/db-seeder';
import { RedisModule } from '@nestjs-modules/ioredis';
import { MappersProfiles } from './infrastructure/mappers/profiles/mappers.profiles';
import { RestaurantCommandHandlers } from './application/features/restaurant/commands/restaurant.commands';
import { RestaurantQueries } from './application/features/restaurant/queries/restaurant.queries';
import { RestaurantProfile } from './infrastructure/mappers/profiles/restaurant.profile';
config();
@Module({
  imports: [
    CommonModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(), 
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: EnvVarsAccessor.DB_HOST,               
      port: +EnvVarsAccessor.DB_HOST,
      username: EnvVarsAccessor.DB_USER_NAME,
      password: EnvVarsAccessor.DB_PASSWORD,       
      database: 'restaurant',    
      entities: PersistenceEntities,
      synchronize: true,
      logging: true,                   
    }),
    TypeOrmModule.forFeature(PersistenceEntities),
    // MulterModule.register({
    //   storage: memoryStorage()
    // }),
    // RedisModule.forRoot({
    //   type: 'single',
    //   url: `redis://${EnvVarsAccessor.REDIS_HOST}:${EnvVarsAccessor.REDIS_PORT}`,
    // }),
  ],
  controllers: RestaurantControllers,
  providers: [
    RestaurantProfile,
    ...ApplicationServices, 
    ...MappersProfiles,
    ...ClientCommandHandlers, 
    ...RestaurantCommandHandlers, 
    ...RestaurantQueries, 
    ...ClientQueries, 
    // ...AuditLogEvents, 
    ...RepositoryProviders, 
    // ...ExternalServicesProviders, 
    DbSeeder
  ],
})
export class RestaurantModule {}
