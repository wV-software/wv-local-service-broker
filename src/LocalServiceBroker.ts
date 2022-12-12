// import { Server as HttpServer, createServer as createHttpServer } from 'http';

import * as http from 'http';
import { Server as SocketServer} from "socket.io";
import { Envelop } from 'wv-local-service';

let httpServer: http.Server|null = null;

enum MessageDirection
{
    request = 'request',
    response = 'response',
}

export class LocalServiceBroker
{
    private static _socketServer: SocketServer;
    public static readonly port = 47979;

    static async isPortBusyAsync(port: number): Promise<boolean>
    {
        return new Promise((resolve) =>
        {
            var net = require('net');
            var server = net.createServer();

            server.once('error', function (err: any)
            {
                if (err.code === 'EADDRINUSE')
                {
                    // port is currently in use
                    resolve(true);
                }
            });

            server.once('listening', function ()
            {
                // close the server if listening doesn't fail
                server.close();
                resolve(false);
            });

            server.listen(port);
        });

    }

    static async waitAsync(ms: number): Promise<void>
    {
        return new Promise<void>((resolve, reject)=>
        {
            setTimeout(resolve, ms);
        });
    }

    static async startAsync()
    {
        while(true)
        {
            if(await this.isPortBusyAsync(this.port))
            {
                // var today = new Date();
                // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                
                // process.stdout.cursorTo(0);
                // process.stdout.write(`${time}`);
                await this.waitAsync(1000);
                continue;
            }

            httpServer = http.createServer(function (req: any, res: any)
            {
                // Set CORS headers
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Request-Method', '*');
                res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
                res.setHeader('Access-Control-Allow-Headers', '*');
            });
    
            httpServer.listen(this.port, () => console.log(`listening http://127.0.0.1:${this.port}`));
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
                    socket.send(`close`);
                    console.log('no clientId, connection will close!');
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
        
                        const envelop = JSON.parse(msg!) as Envelop;
                        if(envelop.destinationServiceName)
                        {
                            this._socketServer.to(envelop.destinationServiceName).emit('message', msg);
                        }
                        console.warn(envelop);
                    }
                    catch(error: any)
                    {
                        console.error(error);
                    }
                });
            }));
        }
    }

    static broadcast(message: string)
    {
        this._socketServer.emit('message', message);
    }
}