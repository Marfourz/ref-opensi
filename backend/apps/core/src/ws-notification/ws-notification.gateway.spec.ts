import { Test, TestingModule } from '@nestjs/testing';
import { WsNotificationGateway } from './ws-notification.gateway';

describe('WsNotificationGateway', () => {
  let gateway: WsNotificationGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WsNotificationGateway],
    }).compile();

    gateway = module.get<WsNotificationGateway>(WsNotificationGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
