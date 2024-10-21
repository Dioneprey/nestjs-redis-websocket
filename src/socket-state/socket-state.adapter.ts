import { INestApplicationContext, WebSocketAdapter } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { SocketStateService } from './socket-state.service';
import socketio from 'socket.io';

interface TokenPayload {
  readonly userId: string;
}

export interface AuthenticatedSocket extends socketio.Socket {
  auth: TokenPayload;
}

export class SocketStateAdapter extends IoAdapter implements WebSocketAdapter {
  public constructor(
    private readonly app: INestApplicationContext,
    private readonly socketStateService: SocketStateService,
  ) {
    super(app);
  }

  private server: socketio.Server;

  // @ts-expect-error type
  public create(
    port: number,
    options: socketio.ServerOptions,
  ): socketio.Server {
    this.server = super.createIOServer(port, options);

    this.server.use(async (socket: AuthenticatedSocket, next) => {
      const token =
        socket.handshake.query?.token ||
        socket.handshake.headers?.authorization;

      if (!token) {
        socket.auth = null;

        // not authenticated connection is still valid
        // thus no error
        return next();
      }

      try {
        // fake auth
        socket.auth = {
          userId: '1234',
        };

        return next();
      } catch (e) {
        return next(e);
      }
    });

    return this.server;
  }

  public bindClientConnect(
    server: socketio.Server,
    callback: (value?: unknown) => void,
  ): void {
    server.on('connection', (socket: AuthenticatedSocket) => {
      if (socket.auth) {
        this.socketStateService.add(socket.auth.userId, socket);

        socket.on('disconnect', () => {
          this.socketStateService.remove(socket.auth.userId, socket);
        });
      }

      callback(socket);
    });
  }
}
