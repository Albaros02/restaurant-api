import { createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { ClientEntity } from 'apps/restaurant/src/domain/entities/client.entity';
import { ClientPersistence } from '../../persistence/client.persistence';
import { RestaurantEntity } from 'apps/restaurant/src/domain/entities/restaurant.entity';
import { RestaurantPersistence } from '../../persistence/restaurant.persistence';

@Injectable()
export class RestaurantProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: Mapper) => {
            // Mapping from RestaurantEntity to RestaurantPersistence
            createMap(mapper, RestaurantEntity, RestaurantPersistence,
                forMember(dest => dest.name, mapFrom(src => src.props.name)),
                forMember(dest => dest.clients, 
                    mapFrom(src => src.props.clients?.map(client => 
                        mapper.map(client,ClientEntity, ClientPersistence)
                    ))
                ),
                forMember(dest => dest.address, mapFrom(src => src.props.address)),
                forMember(dest => dest.capacity, mapFrom(src => src.props.capacity)),
                forMember(dest => dest.id, mapFrom(src => src.id))
            );

            createMap(mapper, RestaurantPersistence, RestaurantEntity,
                forMember(dest => dest.props, mapFrom(src => ({
                    name: src.name,
                    clients: src.clients?.map(client =>
                        mapper.map(client, ClientPersistence, ClientEntity)
                    ),
                    address: src.address,
                    capacity: src.capacity
                }))),
                forMember(dest => dest.id, mapFrom(src => src.id))
            );
        };
    }
}
