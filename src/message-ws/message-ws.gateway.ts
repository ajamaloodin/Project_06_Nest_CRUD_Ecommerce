import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket   } from 'socket.io';
import { MessageWsService } from './message-ws.service';
import { NewMessageDto    } from './dtos/new-message.dto';
import { JwtPayload       } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss: Server;
  
  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtServicce: JwtService )
    
    {}

  async handleConnection(client: Socket) {
    
    const token = client.handshake.headers.auth as string;
    let payload: JwtPayload;
    try {

      payload = this.jwtServicce.verify( token );
      await this.messageWsService.registerClient(client, payload.id);

    } catch (error) {

      client.disconnect();
      return;

    }

    this.wss.emit( 'clients-update', this.messageWsService.getConnectClients() );
    
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);

    this.wss.emit( 'clients-update', this.messageWsService.getConnectClients() );
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient( client: Socket, payload: NewMessageDto ) {

    //!Envía unicamente al cliente emisor del mensaje
      // client.emit('message-from-server', {
      //   fullName: "Me",
      //   message: payload.message || 'no message'
      // })

    //!Envía a todos menos al cliente emisor del mensaje
      // client.broadcast.emit('message-from-server', {
      //   fullName: "Me",
      //   message: payload.message || 'no message'
      // })

    //!Envía a todos incluyendo al emisor
     this.wss.emit('message-from-server', {
      fullName: this.messageWsService.getUserFullName(client.id),
      message: payload.message || 'no message'
    })
      
  }


}
