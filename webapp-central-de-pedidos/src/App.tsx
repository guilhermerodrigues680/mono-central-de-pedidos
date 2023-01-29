import { useEffect, useState } from "react";
import { VERSION_INFO_TXT } from "./config/version-info";

type Order = {
  id: number;
  amount: number;
};

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [connectionStatus, setConnectionStatus] = useState("Desconectado");
  const [requestStatus, setRequestStatus] = useState("");

  async function postOrder({ description }: { description: string }) {
    setRequestStatus("Enviando...");
    try {
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      setRequestStatus("Resposta recebida");
      if (!response.ok) {
        throw new Error("Falha ao enviar pedido");
      }
      setRequestStatus("Pedido enviado com sucesso");
    } catch (error) {
      setRequestStatus("Erro ao enviar pedido");
      console.error(error);
      alert("Erro ao enviar pedido");
    }
  }

  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:3000/api/sse/orders-stream"
    );

    console.debug(eventSource);

    eventSource.addEventListener("open", (event) => {
      console.debug("open", event);
      setConnectionStatus("Conectado");
    });

    eventSource.addEventListener("new-order", (event: MessageEvent<string>) => {
      console.debug("new-order", event);
      const order: Order = JSON.parse(event.data);
      setOrders((prevOrders) => [...prevOrders, order]);
    });

    // eventSource.addEventListener("connected", (event) => {
    //   setConnectionStatus(event.data);
    // });

    eventSource.addEventListener("error", (event) => {
      console.debug("error", event);
      setConnectionStatus("Erro de conexão");
    });

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <div>
        <small>{VERSION_INFO_TXT}</small>
      </div>
      <h2>Status de conexão: {connectionStatus}</h2>

      <h2>Criar pedido</h2>
      <div>
        <button
          type="button"
          onClick={() => postOrder({ description: "AAAA" })}
        >
          Novo pedido
        </button>
      </div>
      <div>
        <p>Status da requisição: {requestStatus}</p>
      </div>

      <h2>Novos pedidos:</h2>
      <ul>
        {orders.map((order, index) => (
          <li key={index}>
            Pedido #{order.id}: R$ {order.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
