import { AutoMap } from '@automapper/classes';
import { AuditablePersistenceEntity } from 'libs/common/infrastructure/persistence/auditable.persistence.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { RestaurantPersistence } from './restaurant.persistence';

@Entity('client')
export class ClientPersistence extends AuditablePersistenceEntity{
    @AutoMap()
    @Column({ type: 'text'})
    public name: string

    @AutoMap()
    @Column({ type: 'text'})
    public email: string

    @AutoMap()
    @Column({ type: 'text'})
    public phone: string

    @AutoMap()
    @Column({ type: 'int2'})
    public age: number

    @ManyToMany(() => RestaurantPersistence, (restaurant) => restaurant.clients)
    restaurants: RestaurantPersistence[];
}
