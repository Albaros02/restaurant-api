import { Controller, Get, Post, Body, Param, Delete, Inject, Res, Query, HttpStatus } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateClientDto } from 'apps/restaurant/src/application/features/client/commands/create/client.create.dto.command';
import { LoggerService } from '../../application/services/ilogger.service';
import { Result } from 'libs/common/application/base';
import { GetTokenUser } from 'libs/common/presentation/auth/decorators/get-user.decorator';
import { GetOneClientQuery } from '../../application/features/client/queries/get-one/client.get-one.query';
import { GetOneClientDto } from '../../application/features/client/queries/get-one/client.get-one.dto';
import { Response } from 'express';
import { PaginationDto } from 'libs/common/presentation/dtos/pagination.dto';
import { CreateClientCommand } from '../../application/features/client/commands/create/client.create.command';
import { ClientEntity } from '../../domain/entities/client.entity';
import { GetAllClientsDto } from '../../application/features/client/queries/get-all/client.get-all.dto';
import { GetAllClientQuery } from '../../application/features/client/queries/get-all/client.get-all.query';
import { DeleteClientCommand } from '../../application/features/client/commands/delete/client.delete.command';

@Controller('client')
export class ClientController {
  constructor(
    private readonly queryBus: QueryBus, 
    private readonly commandBus: CommandBus, 
    
    @Inject("ILoggerService")
    private readonly logger: LoggerService
  ) {}

  @Post()
  async create(
    @GetTokenUser('sub') userId: string, 
    @Body() dto : CreateClientDto
  ) {
    return await this.commandBus.execute<CreateClientCommand,Result<ClientEntity>>(new CreateClientCommand(dto));
  }

  @Post("/all")
  async getAll(
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Body() filter: GetAllClientsDto, 
    @GetTokenUser('sub') userId: string, 
    @Res() res: Response, 
  ) {
    if(!page || !limit)
    {
      return res.status(HttpStatus.BAD_REQUEST).send({error: "Missing pagination."});
    }

    const ans = await this.queryBus.execute<GetAllClientQuery,Result<never>>(      
      new GetAllClientQuery(
        userId,
        filter,
        new PaginationDto(limit,page)
      ) 
    );

    if (ans.isFailure) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ans);
    }

    const clients = ans.unwrap();
    return res.status(HttpStatus.OK).send(clients);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @GetTokenUser('sub') userId: string, 
  ) {
    const ans = await this.queryBus.execute<GetOneClientQuery, Result<ClientEntity>>(
      new GetOneClientQuery(new GetOneClientDto(id), userId)
    );
    
    if (ans.isFailure) {
      return ans.unwrapError()
    }
    return ans.unwrap();    
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
  //   throw new NotImplementedException()
  // }

  @Delete(':clientId')
  async remove(
    @Param('clientId') clientId: string,
    @GetTokenUser('sub') userId: string 
  ) {
    const ans = await this.commandBus.execute<DeleteClientCommand, Result<void>>(
      new DeleteClientCommand(userId,clientId)
    );
    return ans; 
  }
}
