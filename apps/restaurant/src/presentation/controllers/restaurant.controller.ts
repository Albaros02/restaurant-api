import { Controller, Get, Post, Body, Param, Delete, Inject, Res, Query, HttpStatus } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoggerService } from '../../application/services/ilogger.service';
import { Result } from 'libs/common/application/base';
import { GetTokenUser } from 'libs/common/presentation/auth/decorators/get-user.decorator';
import { Response } from 'express';
import { PaginationDto } from 'libs/common/presentation/dtos/pagination.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateRestaurantDto } from '../../application/features/restaurant/commands/create/restaurant.create.dto.command';
import { RestaurantEntity } from '../../domain/entities/restaurant.entity';
import { GetAllRestaurantsDto } from '../../application/features/restaurant/queries/get-all/restaurant.get-all.dto';
import { GetAllRestaurantQuery } from '../../application/features/restaurant/queries/get-all/restaurant.get-all.query';
import { DeleteRestaurantCommand } from '../../application/features/restaurant/commands/delete/restaurant.delete.command';
import { CreateRestaurantCommand } from '../../application/features/restaurant/commands/create/restaurant.create.command';
import { GetOneRestaurantQuery } from '../../application/features/restaurant/queries/get-one/restaurant.get-one.query';
import { GetOneRestaurantDto } from '../../application/features/restaurant/queries/get-one/restaurant.get-one.dto';

@ApiTags('Restaurant')
@Controller('restaurant')
export class RestaurantController {
  constructor(
    private readonly queryBus: QueryBus, 
    private readonly commandBus: CommandBus, 
    
    @Inject("ILoggerService")
    private readonly logger: LoggerService
  ) {}

  @Post()
  async create(
    @GetTokenUser('sub') userId: string, 
    @Body() dto : CreateRestaurantDto
  ) {
    return await this.commandBus.execute<CreateRestaurantCommand,Result<RestaurantEntity>>(new CreateRestaurantCommand(dto));
  }

  @Post("/all")
  async getAll(
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Body() filter: GetAllRestaurantsDto, 
    @GetTokenUser('sub') userId: string, 
    @Res() res: Response, 
  ) {
    if(!page || !limit)
    {
      return res.status(HttpStatus.BAD_REQUEST).send({error: "Missing pagination."});
    }

    const ans = await this.queryBus.execute<GetAllRestaurantQuery,Result<never>>(      
      new GetAllRestaurantQuery(
        userId,
        filter,
        new PaginationDto(limit,page)
      ) 
    );

    if (ans.isFailure) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ans);
    }

    const Restaurants = ans.unwrap();
    return res.status(HttpStatus.OK).send(Restaurants);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @GetTokenUser('sub') userId: string, 
  ) {
    const ans = await this.queryBus.execute<GetOneRestaurantQuery, Result<RestaurantEntity>>(
      new GetOneRestaurantQuery(new GetOneRestaurantDto(id), userId)
    );
    
    if (ans.isFailure) {
      return ans.unwrapError()
    }
    return ans.unwrap();    
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRestaurantDto: UpdateRestaurantDto) {
  //   throw new NotImplementedException()
  // }

  @Delete(':RestaurantId')
  async remove(
    @Param('RestaurantId') RestaurantId: string,
    @GetTokenUser('sub') userId: string 
  ) {
    const ans = await this.commandBus.execute<DeleteRestaurantCommand, Result<void>>(
      new DeleteRestaurantCommand(userId,RestaurantId)
    );
    return ans; 
  }
}
