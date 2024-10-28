import { OrderEntity } from "apps/restaurant/src/domain/entities/order.entity";
import { OrderPersistence } from "apps/restaurant/src/infrastructure/persistence/order.persistence";
import { IGenericRepository } from "libs/common/application/interfaces/igeneric-repository";

export interface IOrderRepository extends IGenericRepository<OrderEntity,OrderPersistence>
{
}