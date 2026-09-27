import { useState } from "react";
import { criarPedido } from "../api/backend";

export default function Cart({ itens, aoAlterarQuantidade, aoRemover, aoFinalizarPedido }) {
  const [nomeCliente, setNomeCliente] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

  async function finalizarPedido() {
    if (!nomeCliente.trim()) {
      setMensagem({ tipo: "erro", texto: "Informe seu nome para finalizar o pedido." });
      return;
    }
    if (itens.length === 0) {
      setMensagem({ tipo: "erro", texto: "Seu carrinho está vazio." });
      return;
    }
    setEnviando(true);
    setMensagem(null);
    try {
      const pedido = await criarPedido(nomeCliente, itens);
      setMensagem({ tipo: "sucesso", texto: `Pedido #${pedido.id} criado com sucesso!` });
      aoFinalizarPedido();
      setNomeCliente("");
    } catch (e) {
      setMensagem({ tipo: "erro", texto: e.message });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="carrinho">
      <h2>Carrinho</h2>
      {itens.length === 0 && <p>Nenhum item no carrinho.</p>}
      {itens.map((item) => (
        <div className="item-carrinho" key={item.id}>
          <span>{item.titulo}</span>
          <input
            type="number"
            min="1"
            value={item.quantidade}
            onChange={(e) => aoAlterarQuantidade(item.id, Number(e.target.value))}
          />
          <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
          <button onClick={() => aoRemover(item.id)}>Remover</button>
        </div>
      ))}

      <p className="total">Total: R$ {total.toFixed(2)}</p>

      <input
        type="text"
        placeholder="Seu nome"
        value={nomeCliente}
        onChange={(e) => setNomeCliente(e.target.value)}
      />
      <button disabled={enviando} onClick={finalizarPedido}>
        {enviando ? "Enviando..." : "Finalizar pedido"}
      </button>

      {mensagem && <p className={mensagem.tipo}>{mensagem.texto}</p>}
    </section>
  );
}
