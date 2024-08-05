import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SensorData } from '../entities/sensor-data.entity';
import { CreateSensorDataDto } from '../dto/create-sensor-data.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class SensorGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('SensorGateway');

  constructor(
    @InjectModel(SensorData.name)
    private sensorDataModel: Model<SensorData>,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  @SubscribeMessage('sensor-data')
  async handleSensorData(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateSensorDataDto,
  ): Promise<void> {
    if (this.validateSensorData(data)) {
      const createdSensorData = new this.sensorDataModel({
        ...data,
        timestamp: new Date(),
      });
      await createdSensorData.save();
      this.server.emit('sensor-data', data);
    } else {
      client.emit('error', 'Invalid data format');
    }
  }

  private validateSensorData(data: any): boolean {
    return (
      data &&
      typeof data.temperature === 'number' &&
      typeof data.humidity === 'number'
    );
  }
}
