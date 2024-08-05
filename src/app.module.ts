import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorGateway } from './modules/sensors/gateways/sensors.gateway';
import {
  SensorData,
  SensorDataSchema,
} from './modules/sensors/entities/sensor-data.entity';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: SensorData.name, schema: SensorDataSchema },
    ]),
  ],
  providers: [SensorGateway],
})
export class AppModule {}
 