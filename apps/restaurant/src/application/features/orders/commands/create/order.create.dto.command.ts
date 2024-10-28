import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
    @ApiProperty({
        example: 'Random description',
    })
    public description: string;

    @ApiProperty({
    })
    public clientId: string;

    @ApiProperty({
    })
    public restaurantId: string;
}
