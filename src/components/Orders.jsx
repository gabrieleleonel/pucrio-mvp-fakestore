import { useEffect, useState, useCallback } from "react";
import { listarPedidos, atualizarStatusPedido, deletarPedido } from "../api/backend";

const STATUS_OPCOES = ["pendente", "pago", "enviado", "cancelado"];

export default function Orders({ recarregar }) {
  const [pedidos, setPedidos] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [erro, setErro] = useState(null);
  const tamanhoPagina = 5;

  const carregar = useCallback(async () => {
    try {
      setErro(null);
      const resultado = await listarPedidos({
        status: filtroStatus || undefined,
        pagina,
        tamanhoPagina,
      });
      setPedidos(resultado.resultados);
      setTotalRegistros(resultado.total_registros);
    } catch (e) {
      setErro(e.message);
    }
  }, [filtroStatus, pagina]);

  useEffect(() => {
    carregar();
  }, [carregar, recarregar]);

  async function mudarStatus(id, novoStatus) {
    try {
      await atualizarStatusPedido(id, novoStatus);
      carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  async function cancelarPedido(id) {
    try {
      await deletarPedido(id);
      carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  const totalPaginas = Math.max(1, Math.ceil(totalRegistros / tamanhoPagina));

  return (
    <section className="pedidos">
      <h2>Meus Pedidos</h2>

      <label htmlFor="filtro-status">Filtrar por status: </label>
      <select
        id="filtro-status"
        value={filtroStatus}
        onChange={(e) => {
          setFiltroStatus(e.target.value);
          setPagina(1);
        }}
      >
        <option value="">Todos</option>
        {STATUS_OPCOES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {erro && <p className="erro">{erro}</p>}

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>{pedido.cliente_nome}</td>
              <td>R$ {pedido.total.toFixed(2)}</td>
              <td>
                <select
                  value={pedido.status}
                  onChange={(e) => mudarStatus(pedido.id, e.target.value)}
                >
                  {STATUS_OPCOES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button onClick={() => cancelarPedido(pedido.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="paginacao">
        <button disabled={pagina <= 1} onClick={() => setPagina((p) => p - 1)}>
          Anterior
        </button>
        <span>
          Página {pagina} de {totalPaginas}
        </span>
        <button disabled={pagina >= totalPaginas} onClick={() => setPagina((p) => p + 1)}>
          Próxima
        </button>
      </div>
    </section>
  );
}
