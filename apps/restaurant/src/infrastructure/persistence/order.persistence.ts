import { AutoMap } from '@automapper/classes';
import { AuditablePersistenceEntity } from 'libs/common/infrastructure/persistence/auditable.persistence.entity';
import { Entity, Column, ManyToMany, JoinTable, OneToOne } from 'typeorm';
import { ClientPersistence } from './client.persistence';
import { RestaurantPersistence } from './restaurant.persistence';

@Entity('order')
export class OrderPersistence extends AuditablePersistenceEntity{
    
    @AutoMap()
    @Column({ type: "text" })
    public description: string

    @AutoMap()
    @OneToOne(() => ClientPersistence)
    public client: ClientPersistence | { id : string }

    @AutoMap()
    @OneToOne(() => RestaurantPersistence)
    public restaurant: RestaurantPersistence | { id : string }
}
