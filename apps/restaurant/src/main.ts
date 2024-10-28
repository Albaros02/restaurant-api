import { NestFactory } from '@nestjs/core';
import { RestaurantModule } from './restaurant.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvVarsAccessor } from 'libs/common/configs/env-vars-accessor';
import { DbSeeder } from './infrastructure/seed/db-seeder';

async function bootstrap() {

  const app = await NestFactory.create(RestaurantModule);
  
  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    credentials: true,
  });

  app.setGlobalPrefix('api/restaurant');

  const openApi = new DocumentBuilder()
    .setTitle('Restaurant Microservice')
    .setVersion('1.0')
    .build(); 

  const document = SwaggerModule.createDocument(app, openApi);
  SwaggerModule.setup('api/restaurant/docs', app, document);

  await app.startAllMicroservices();
  await app.listen(EnvVarsAccessor.MS_PORT);
  console.log(`Restaurant microservice is running on: ${await app.getUrl()}`);
  
  const dbSeeder = app.get<DbSeeder>(DbSeeder);
  await dbSeeder.seed(); 
}

bootstrap();
