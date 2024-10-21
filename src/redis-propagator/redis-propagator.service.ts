import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

import {
  REDIS_SOCKET_EVENT_EMIT_ALL_NAME,
  REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME,
  REDIS_SOCKET_EVENT_SEND_NAME,
} from './redis-propagator.constants';
import { SocketStateService } from 'src/socket-state/socket-state.service';
import { RedisService } from 'src/redis/redis.service';
import { RedisSocketEventSendDTO } from './dto/socket-event-send.dto';
import { RedisSocketEventEmitDTO } from './dto/socket-event-emit.dto';

@Injectable()
export class RedisPropagatorService {
  private socketServer: Server;

  public constructor(
    private readonly socketStateService: SocketStateService,
    private readonly redisService: RedisService,
  ) {}

  public propagateEvent(eventInfo: RedisSocketEventSendDTO): boolean {
    if (!eventInfo.userId) {
      return false;
    }

    this.redisService.publish(REDIS_SOCKET_EVENT_SEND_NAME, eventInfo);

    return true;
  }

  public emitToAuthenticated(eventInfo: RedisSocketEventEmitDTO): boolean {
    this.redisService.publish(
      REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME,
      eventInfo,
    );

    return true;
  }

  public emitToAll(eventInfo: RedisSocketEventEmitDTO): boolean {
    this.redisService.publish(REDIS_SOCKET_EVENT_EMIT_ALL_NAME, eventInfo);

    return true;
  }
}
