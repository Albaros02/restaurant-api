import { ApiProperty } from '@nestjs/swagger';

export class ReserveRestaurantDto {
    @ApiProperty({
        description: 'Id del restaurante',
    })
    public restaurantId: string; 

    @ApiProperty({
        description: 'Id del client',
    })
    public clientId: string; 
}
