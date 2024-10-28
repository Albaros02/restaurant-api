import { createMap, forMember, mapFrom } from '@automapper/core'; 
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { ClientEntity } from 'apps/restaurant/src/domain/entities/client.entity';
import { ClientPersistence } from '../../persistence/client.persistence';

@Injectable()
export class ClientProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: Mapper) => {
            createMap(mapper, ClientEntity, ClientPersistence,
                forMember(dest => dest.email, mapFrom(src => src.props.email)),
                forMember(dest => dest.age, mapFrom(src => src.props.age)),
                forMember(dest => dest.name, mapFrom(src => src.props.name)),
                forMember(dest => dest.phone, mapFrom(src => src.props.phone)),
                forMember(dest => dest.id, mapFrom(src => src.id))
            );

            createMap(mapper, ClientPersistence, ClientEntity,
                forMember(dest => dest.props, mapFrom(src => ({
                    email: src.email,
                    age: src.age, 
                    name: src.name,
                    phone: src.phone
                }))),
                forMember(dest => dest.id, mapFrom(src => src.id))
            );
        };
    }
}
