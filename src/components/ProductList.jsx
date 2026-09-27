import { useEffect, useState } from "react";
import { buscarProdutos, buscarCategorias } from "../api/fakestore";

export default function ProductList({ aoAdicionarAoCarrinho }) {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    buscarCategorias().then(setCategorias).catch(() => {});
  }, []);

  useEffect(() => {
    setCarregando(true);
    setErro(null);
    buscarProdutos(categoriaSelecionada || undefined)
      .then(setProdutos)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, [categoriaSelecionada]);

  return (
    <section>
      <div className="filtro-categorias">
        <label htmlFor="categoria">Categoria: </label>
        <select
          id="categoria"
          value={categoriaSelecionada}
          onChange={(e) => setCategoriaSelecionada(e.target.value)}
        >
          <option value="">Todas</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {carregando && <p>Carregando produtos...</p>}
      {erro && <p className="erro">{erro}</p>}

      <div className="grid-produtos">
        {produtos.map((produto) => (
          <div className="card-produto" key={produto.id}>
            <img src={produto.imagem} alt={produto.titulo} />
            <h3>{produto.titulo}</h3>
            <p className="preco">R$ {produto.preco.toFixed(2)}</p>
            <button onClick={() => aoAdicionarAoCarrinho(produto)}>
              Adicionar ao carrinho
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
