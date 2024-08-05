import { Test, TestingModule } from '@nestjs/testing';
import { SensorGateway } from './sensors.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorData, SensorDataSchema } from '../entities/sensor-data.entity';
import { INestApplication } from '@nestjs/common';
import { Server } from 'socket.io';
import * as io from 'socket.io-client';
import { ConfigModule } from '@nestjs/config';

describe('SensorGateway', () => {
  let app: INestApplication;
  let server: Server;
  let clientSocket;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.MONGO_TESTING_URI),
        MongooseModule.forFeature([
          { name: SensorData.name, schema: SensorDataSchema },
        ]),
      ],
      providers: [SensorGateway],
    }).compile();

    app = moduleFixture.createNestApplication();
    server = app.getHttpServer();
    await app.listen(3001);
    clientSocket = io.connect('http://localhost:3001');
  });

  afterAll(async () => {
    clientSocket.disconnect();
    await app.close();
  });

  it('should connect to WebSocket server', (done) => {
    clientSocket.on('connect', () => {
      expect(clientSocket.connected).toBe(true);
      done();
    });
  });

  it('should receive error for invalid data', (done) => {
    clientSocket.emit('sensor-data', { temperature: 'invalid', humidity: 60 });
    clientSocket.on('error', (data) => {
      expect(data).toBe('Invalid data format');
      done();
    });
  });

  it('should save valid data and broadcast', (done) => {
    clientSocket.emit('sensor-data', { temperature: 22, humidity: 60 });
    clientSocket.on('sensor-data', (data) => {
      expect(data.temperature).toBe(22);
      expect(data.humidity).toBe(60);
      done();
    });
  });
});
