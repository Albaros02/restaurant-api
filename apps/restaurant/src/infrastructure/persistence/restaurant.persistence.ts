import { AutoMap } from '@automapper/classes';
import { AuditablePersistenceEntity } from 'libs/common/infrastructure/persistence/auditable.persistence.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { ClientPersistence } from './client.persistence';

@Entity('restaurant')
export class RestaurantPersistence extends AuditablePersistenceEntity{
    @AutoMap()
    @Column({ type: 'text'})
    public name: string

    @AutoMap()
    @Column({ type: 'text'})
    public address: string

    @AutoMap()
    @Column({ type: 'int'})
    public capacity: number

    @AutoMap()
    @ManyToMany(() => ClientPersistence, (client) => client.restaurants, { nullable: true, eager: true })
    @JoinTable()  
    public clients?: ClientPersistence[];
}