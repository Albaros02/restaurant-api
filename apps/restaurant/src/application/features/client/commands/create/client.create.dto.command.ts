import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
    @ApiProperty({
        description: 'Nombre del cliente',
        example: 'Juan Pérez',
    })
    public name: string; 

    @ApiProperty({
        description: 'Número de teléfono del cliente',
        example: '+34123456789',
    })
    public phone: string; 

    @ApiProperty({
        description: 'Correo electrónico del cliente',
        example: 'juan.perez@example.com',
    })
    public email: string; 

    @ApiProperty({
        description: 'Edad del cliente',
        example: 30,
        minimum: 1,
    })
    public age: number; 
}
