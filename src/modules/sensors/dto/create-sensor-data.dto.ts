import { IsNotEmpty, IsNumber } from '@nestjs/class-validator';

export class CreateSensorDataDto {
  @IsNotEmpty()
  @IsNumber()
  temperature: number;

  @IsNotEmpty()
  @IsNumber()
  humidity: number;

  @IsNotEmpty()
  timestamp: Date;
}
