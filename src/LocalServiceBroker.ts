// import { Server as HttpServer, createServer as createHttpServer } from 'http';

import * as http from 'http';
import { Server as SocketServer} from "socket.io";

let httpServer: http.Server|null = null;

export enum MessageDirection
{
    request = 'request',
    response = 'response',
}

export interface IRoutedMessage
{
    dialogId: string | null;
    direction: MessageDirection;
    sourceId: string;
    destinationId: string;
    remoteProcedureName: string;
    payload: object;
}

export class LocalServiceBroker
{
    private static _socketServer: SocketServer;

    static start(port: number)
    {
        httpServer = http.createServer(function (req: any, res: any)
        {
            // Set CORS headers
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Request-Method', '*');
            res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
            res.setHeader('Access-Control-Allow-Headers', '*');
        });

        httpServer.listen(port, () => console.log(`listening http://127.0.0.1:${port}`));
        this._socketServer = new SocketServer().listen(httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
    
        this._socketServer.on('connection', (async (socket) =>
        {
            const clientIdBase64:string = (socket.request as any)._query?.clientId;

            if(!clientIdBase64) 
            {
                console.log('no clientId');
                socket.send(`close`);
            }
            else
            {
                const clientId = atob(clientIdBase64);
                console.log(`>>> connected: ${clientId}`);           
                this._socketServer.to(clientId).emit('message', 'close');
                socket.join(clientId);
            }

            socket.conn.on('close', ()=>
            {
                if(clientIdBase64)
                {
                    const clientId = atob(clientIdBase64);
                    console.log(`<<< disconnected: ${clientId}`);         
                }
                else
                {
                    console.log('connection rejected: no query.clientId');
                }
            });

            socket.conn.on('message', (msg: string)=>
            {
                try
                {
                    console.warn(`raw message: ${msg}`)

                    if(msg.length < 2) return;

                    msg = msg.substring(1);
                    const args = JSON.parse(msg) as Array<string>;
                    msg = args[1];
    
                    const routedMessage = JSON.parse(msg!) as IRoutedMessage;
                    if(routedMessage.destinationId)
                    {
                        this._socketServer.to(routedMessage.destinationId).emit('message', msg);
                    }
                    console.warn(routedMessage);
                }
                catch(error: any)
                {
                    console.error(error);
                }
            });
        }));
    }

    static broadcast(message: string)
    {
        this._socketServer.emit('message', message);
    }
}