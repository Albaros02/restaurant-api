import { createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { ClientPersistence } from '../../persistence/client.persistence';
import { OrderEntity } from 'apps/restaurant/src/domain/entities/order.entity';
import { OrderPersistence } from '../../persistence/order.persistence';
import { ClientEntity } from 'apps/restaurant/src/domain/entities/client.entity';
import { RestaurantEntity } from 'apps/restaurant/src/domain/entities/restaurant.entity';
import { RestaurantPersistence } from '../../persistence/restaurant.persistence';

@Injectable()
export class OrderProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: Mapper) => {
            // Mapping from OrderEntity to OrderPersistence
            createMap(mapper, OrderEntity, OrderPersistence,
                forMember(dest => dest.description, mapFrom(src => src.props.description)),
                forMember(dest => dest.clientId, mapFrom(src => src.props.client.id)),
                forMember(dest => dest.restaurantId, mapFrom(src => src.props.restaurant.id)),
                forMember(dest => dest.client, 
                    mapFrom(src => mapper.map(src.props.client,ClientEntity, ClientPersistence))
                ),
                forMember(dest => dest.restaurant, 
                    mapFrom(src => mapper.map(src.props.restaurant,RestaurantEntity, RestaurantPersistence))
                ),
                forMember(dest => dest.id, mapFrom(src => src.id))
            );

            createMap(mapper, OrderPersistence, OrderEntity,
                forMember(dest => dest.props, mapFrom(src => ({
                    description: src.description,
                    client: mapper.map(src.client, ClientPersistence, ClientEntity),
                    restaurant: mapper.map(src.restaurant, RestaurantPersistence, RestaurantEntity),
                }))),
                forMember(dest => dest.id, mapFrom(src => src.id))
            );
        };
    }
}
