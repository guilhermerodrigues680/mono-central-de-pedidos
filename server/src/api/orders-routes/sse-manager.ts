import { type IncomingMessage, type ServerResponse } from "node:http";
import type pino from "pino";

export class SSEManager {
  private readonly _connections = new Map<
    string,
    ServerResponse<IncomingMessage>
  >();
  private readonly _log: pino.BaseLogger;

  constructor(log: pino.BaseLogger) {
    this._log = log;
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

      // CORS
      "Access-Control-Allow-Origin": "*",
    };
    res.writeHead(200, headers);

    this._connections.set(clientId, res);
    this._log.info({ clientId }, "Connection open");

    // Enviando um evento inicial para o cliente
    res.write("event: connected\ndata: Connection established\n\n");

    res.on("close", () => {
      this._log.info({ clientId }, "Connection closed");
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
