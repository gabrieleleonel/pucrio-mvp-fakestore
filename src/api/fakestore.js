// API externa pública e gratuita, usada apenas para consulta de produtos.
// Documentação: https://fakestoreapi.com/docs
// Não requer cadastro nem chave de API.
const FAKESTORE_URL = "https://fakestoreapi.com";

export async function buscarProdutos(categoria) {
  const url = categoria
    ? `${FAKESTORE_URL}/products/category/${encodeURIComponent(categoria)}`
    : `${FAKESTORE_URL}/products`;
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os produtos da FakeStore.");
  }
  // Os dados são consumidos e tratados aqui (mapeados para o formato da loja),
  // sem redirecionar o usuário para a FakeStore.
  const dados = await resposta.json();
  return dados.map((produto) => ({
    id: produto.id,
    titulo: produto.title,
    preco: produto.price,
    imagem: produto.image,
    categoria: produto.category,
    descricao: produto.description,
  }));
}

export async function buscarCategorias() {
  const resposta = await fetch(`${FAKESTORE_URL}/products/categories`);
  if (!resposta.ok) {
    throw new Error("Não foi possível carregar as categorias.");
  }
  return resposta.json();
}
