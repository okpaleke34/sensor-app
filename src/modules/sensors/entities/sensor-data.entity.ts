import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class SensorData extends Document {
  @Prop({ required: true })
  temperature: number;

  @Prop({ required: true })
  humidity: number;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const SensorDataSchema = SchemaFactory.createForClass(SensorData);
