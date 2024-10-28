import { Controller, Get, Post, Body, Param, Delete, Inject, Res, Query, HttpStatus } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoggerService } from '../../application/services/ilogger.service';
import { Result } from 'libs/common/application/base';
import { GetTokenUser } from 'libs/common/presentation/auth/decorators/get-user.decorator';
import { Response } from 'express';
import { PaginationDto } from 'libs/common/presentation/dtos/pagination.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from '../../application/features/orders/commands/create/order.create.dto.command';
import { CreateOrderCommand } from '../../application/features/orders/commands/create/order.create.command';
import { OrderEntity } from '../../domain/entities/order.entity';
import { GetAllOrderDto } from '../../application/features/orders/queries/get-all/order.get-all.dto';
import { GetAllOrderQuery } from '../../application/features/orders/queries/get-all/order.get-all.query';
import { DeleteOrderCommand } from '../../application/features/orders/commands/delete/order.delete.command';
import { ReserveRestaurantDto } from '../../application/features/client/commands/reserve/client.reserve.dto.command';
import { ReserveRestaurantCommand } from '../../application/features/client/commands/reserve/client.reserve.command';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(
    private readonly queryBus: QueryBus, 
    private readonly commandBus: CommandBus, 
    
    @Inject("ILoggerService")
    private readonly logger: LoggerService
  ) {}

  @Post()
  async create(
    @GetTokenUser('sub') userId: string, 
    @Body() dto : CreateOrderDto
  ) {
    return await this.commandBus.execute<CreateOrderCommand,Result<OrderEntity>>(new CreateOrderCommand(dto));
  }

  @Post("/all")
  async getAll(
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Body() filter: GetAllOrderDto, 
    @GetTokenUser('sub') userId: string, 
    @Res() res: Response, 
  ) {
    if(!page || !limit)
    {
      return res.status(HttpStatus.BAD_REQUEST).send({error: "Missing pagination."});
    }

    const ans = await this.queryBus.execute<GetAllOrderQuery,Result<never>>(      
      new GetAllOrderQuery(
        userId,
        filter,
        new PaginationDto(limit,page)
      ) 
    );

    if (ans.isFailure) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ans);
    }

    const Orders = ans.unwrap();
    return res.status(HttpStatus.OK).send(Orders);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   throw new NotImplementedException()
  // }

  @Delete(':orderId')
  async remove(
    @Param('orderId') orderId: string,
    @GetTokenUser('sub') userId: string 
  ) {
    const ans = await this.commandBus.execute<DeleteOrderCommand, Result<void>>(
      new DeleteOrderCommand(userId,orderId)
    );
    return ans; 
  }

  @Post('reserve')
  async reserve(
    @GetTokenUser('sub') userId: string, 
    @Body() dto : ReserveRestaurantDto
  ) {
    return await this.commandBus.execute<ReserveRestaurantCommand,Result<any>>(new ReserveRestaurantCommand(dto));
  }
}
