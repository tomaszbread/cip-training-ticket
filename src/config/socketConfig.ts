import { Server } from "socket.io";
import { createServer } from "http";
class SocketConfig {

    public io: Server
    public httpServer: any
    
    public constructor(express:any) {
        this.httpServer = createServer(express);
        this.io = new Server(this.httpServer);
        this.ioConnection();
    }

    public ioConnection() {
        this.io.on("connection", (socket) => { });
        this.io.on('disconnect', () => { })
    }

    public startServer(port: number) {
        this.httpServer.listen(port);
        console.log(`Socket.io server listening on port ${port}`);
    }

}
export default SocketConfig;