import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateUrlDto {
    @IsString()
    originalUrl: string;

    @IsOptional()
    @IsUUID()
    userId?: string;
}
