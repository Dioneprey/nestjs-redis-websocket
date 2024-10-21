import { INestApplication } from '@nestjs/common';
import { SocketStateService } from './socket-state/socket-state.service';
import { SocketStateAdapter } from './socket-state/socket-state.adapter';

export const initAdapters = (app: INestApplication): INestApplication => {
  const socketStateService = app.get(SocketStateService);
  const redisPropagatorService = app.get(RedisPropagatorService);

  app.useWebSocketAdapter(
    new SocketStateAdapter(app, socketStateService, redisPropagatorService),
  );

  return app;
};
