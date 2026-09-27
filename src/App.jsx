import { useState } from "react";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Orders from "./components/Orders";

export default function App() {
  const [aba, setAba] = useState("catalogo");
  const [carrinho, setCarrinho] = useState([]);
  const [recarregarPedidos, setRecarregarPedidos] = useState(0);

  function adicionarAoCarrinho(produto) {
    setCarrinho((atual) => {
      const existente = atual.find((item) => item.id === produto.id);
      if (existente) {
        return atual.map((item) =>
          item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }
      return [...atual, { ...produto, quantidade: 1 }];
    });
  }

  function alterarQuantidade(id, quantidade) {
    setCarrinho((atual) =>
      atual.map((item) => (item.id === id ? { ...item, quantidade } : item))
    );
  }

  function removerDoCarrinho(id) {
    setCarrinho((atual) => atual.filter((item) => item.id !== id));
  }

  function aoFinalizarPedido() {
    setCarrinho([]);
    setRecarregarPedidos((n) => n + 1);
    setAba("pedidos");
  }

  return (
    <div className="app">
      <header>
        <h1>🛒 Loja MVP</h1>
        <nav>
          <button onClick={() => setAba("catalogo")} className={aba === "catalogo" ? "ativo" : ""}>
            Catálogo
          </button>
          <button onClick={() => setAba("carrinho")} className={aba === "carrinho" ? "ativo" : ""}>
            Carrinho ({carrinho.length})
          </button>
          <button onClick={() => setAba("pedidos")} className={aba === "pedidos" ? "ativo" : ""}>
            Meus Pedidos
          </button>
        </nav>
      </header>

      <main>
        {aba === "catalogo" && <ProductList aoAdicionarAoCarrinho={adicionarAoCarrinho} />}
        {aba === "carrinho" && (
          <Cart
            itens={carrinho}
            aoAlterarQuantidade={alterarQuantidade}
            aoRemover={removerDoCarrinho}
            aoFinalizarPedido={aoFinalizarPedido}
          />
        )}
        {aba === "pedidos" && <Orders recarregar={recarregarPedidos} />}
      </main>
    </div>
  );
}
