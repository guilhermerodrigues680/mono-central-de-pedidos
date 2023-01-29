import { type IncomingMessage, type ServerResponse } from "node:http";

export class SSEManager {
  private readonly _connections = new Map<
    string,
    ServerResponse<IncomingMessage>
  >();

  constructor() {
    this.startPingConnectionsRoutine();
  }

  public incomingMessageToSSE(
    clientId: string,
    res: ServerResponse<IncomingMessage>
  ) {
    const headers = {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    };
    res.writeHead(200, headers);

    this._connections.set(clientId, res);

    // Enviando um evento inicial para o cliente
    res.write("event: connected\ndata: Connection established\n\n");

    res.on("close", () => {
      console.log(`Connection closed, clientId '${clientId}'`);
      this._connections.delete(clientId);
    });
  }

  public async broadcastMessage(data: unknown) {
    const msgTxt = typeof data === "string" ? data : JSON.stringify(data);

    // Enviando o evento de novo pedido aos clientes SSE
    this._connections.forEach((sseR) => {
      sseR.write(`event: new-order\ndata: ${msgTxt}\n\n`, (err) => {
        console.debug("sseR.write callback", err);
      });
    });
  }

  private startPingConnectionsRoutine() {
    let c = 0;

    setInterval(() => {
      if (this._connections.size === 0) {
        return;
      }

      // Envia um comentário para conexão para mantê-las ativas
      c++;
      this._connections.forEach((sseR) => sseR.write(`: ${c}\n\n`));
    }, 2000);
  }
}
