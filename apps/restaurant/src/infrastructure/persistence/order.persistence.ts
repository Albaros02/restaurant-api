import { AutoMap } from '@automapper/classes';
import { AuditablePersistenceEntity } from 'libs/common/infrastructure/persistence/auditable.persistence.entity';
import { Entity, Column, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { ClientPersistence } from './client.persistence';
import { RestaurantPersistence } from './restaurant.persistence';

@Entity('order')
export class OrderPersistence extends AuditablePersistenceEntity{
    
    @AutoMap()
    @Column({ type: "text" })
    public description: string

    @AutoMap()
    @Column({ type: "text", name: "client_id" })
    public clientId: string

    @AutoMap()
    @Column({ type: "text", name: "restaurant_id" })
    public restaurantId: string


    @AutoMap()
    @OneToOne(() => ClientPersistence ,{ eager: true })
    @JoinColumn({name: "client_id"})
    public client: ClientPersistence | { id : string }

    @AutoMap()
    @OneToOne(() => RestaurantPersistence,{ eager: true })
    @JoinColumn({name: "restaurant_id"})
    public restaurant: RestaurantPersistence | { id : string }
}
