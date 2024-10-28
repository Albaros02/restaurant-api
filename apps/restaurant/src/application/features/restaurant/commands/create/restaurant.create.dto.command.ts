import { ApiProperty } from '@nestjs/swagger';

export class CreateRestaurantDto {
    @ApiProperty({
        description: 'Nombre del restaurante',
        example: 'Restaurante El Sabor',
    })
    public name: string;

    @ApiProperty({
        description: 'Dirección del restaurante',
        example: 'Calle Principal 123, Ciudad, País',
    })
    public address: string;

    @ApiProperty({
        description: 'Capacidad máxima del restaurante (número de personas)',
        example: 100,
        minimum: 1, 
    })
    public capacity: number;
}
