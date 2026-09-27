// URL da API de pedidos (back-end próprio). Configurável via variável de
// ambiente para funcionar tanto em dev quanto dentro do container Docker.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function tratarResposta(resposta) {
  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    throw new Error(erro.detail || `Erro na requisição (${resposta.status})`);
  }
  if (resposta.status === 204) return null;
  return resposta.json();
}

// POST /pedidos
export async function criarPedido(clienteNome, itens) {
  const resposta = await fetch(`${API_URL}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cliente_nome: clienteNome,
      itens: itens.map((item) => ({
        produto_id: item.id,
        titulo: item.titulo,
        preco: item.preco,
        quantidade: item.quantidade,
      })),
    }),
  });
  return tratarResposta(resposta);
}

// GET /pedidos
export async function listarPedidos({ status, pagina = 1, tamanhoPagina = 10 } = {}) {
  const params = new URLSearchParams({ pagina, tamanho_pagina: tamanhoPagina });
  if (status) params.set("status", status);
  const resposta = await fetch(`${API_URL}/pedidos?${params.toString()}`);
  return tratarResposta(resposta);
}

// PUT /pedidos/{id}
export async function atualizarStatusPedido(id, status) {
  const resposta = await fetch(`${API_URL}/pedidos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return tratarResposta(resposta);
}

// DELETE /pedidos/{id}
export async function deletarPedido(id) {
  const resposta = await fetch(`${API_URL}/pedidos/${id}`, {
    method: "DELETE",
  });
  return tratarResposta(resposta);
}
