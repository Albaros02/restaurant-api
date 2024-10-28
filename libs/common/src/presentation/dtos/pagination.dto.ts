import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
    @ApiProperty({
        example: 10,
        minimum: 1
    })
    public limit: number;

    @ApiProperty({
        example: 1,
        minimum: 1
    })
    public page: number;
    constructor(limit: number, page: number) {
        this.limit = limit;
        this.page = page;
    }
}
