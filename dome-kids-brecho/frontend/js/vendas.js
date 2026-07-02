// =========================================================
// vendas.js
// Toda a logica da pagina de VENDAS: monta um carrinho,
// envia a venda para a API (/vendas/salvar), lista o
// historico e permite ver detalhes / cancelar vendas.
// =========================================================

let roupasDisponiveis = [];
let clientesDisponiveis = [];
let vendasCache = [];
let carrinho = []; // { roupa_id, nome, preco, quantidade }

const selectCliente = document.getElementById('venda-cliente');
const selectRoupa = document.getElementById('venda-roupa');
const inputQuantidade = document.getElementById('venda-quantidade');
const carrinhoLista = document.getElementById('carrinho-lista');
const carrinhoTotalValor = document.getElementById('carrinho-total-valor');
const listaVendas = document.getElementById('lista-vendas');
const modalVenda = document.getElementById('modal-venda');
const detalhesVenda = document.getElementById('detalhes-venda');

// ---------------------------------------------------------
// Carregamento inicial (roupas, clientes, vendas)
// ---------------------------------------------------------
async function carregarDadosIniciais() {
    try {
        const [roupas, clientes, vendas] = await Promise.all([
            api.get('/roupas/listar'),
            api.get('/clientes/listar'),
            api.get('/vendas/listar')
        ]);

        roupasDisponiveis = roupas.filter((r) => r.quantidade > 0);
        clientesDisponiveis = clientes;
        vendasCache = vendas;

        preencherSelectRoupas();
        preencherSelectClientes();
        renderizarVendas();
    } catch (erro) {
        mostrarAlerta('Nao foi possivel carregar os dados. Verifique se o back-end esta rodando.', 'erro');
    }
}

function preencherSelectRoupas() {
    if (roupasDisponiveis.length === 0) {
        selectRoupa.innerHTML = '<option value="">Nenhuma peca em estoque</option>';
        return;
    }
    selectRoupa.innerHTML = roupasDisponiveis
        .map((r) => `<option value="${r.id}">${r.nome} — Tam. ${r.tamanho} (${formatarMoeda(r.preco)}) · ${r.quantidade} disp.</option>`)
        .join('');
}

function preencherSelectClientes() {
    const opcoesExtras = clientesDisponiveis
        .map((c) => `<option value="${c.id}">${c.nome}</option>`)
        .join('');
    selectCliente.innerHTML = `<option value="">Cliente nao identificado</option>${opcoesExtras}`;
}

// ---------------------------------------------------------
// Carrinho
// ---------------------------------------------------------
function adicionarAoCarrinho() {
    const roupaId = Number(selectRoupa.value);
    const quantidade = Number(inputQuantidade.value);

    if (!roupaId) {
        mostrarAlerta('Selecione uma peca para adicionar.', 'erro');
        return;
    }
    if (!quantidade || quantidade < 1) {
        mostrarAlerta('Informe uma quantidade valida.', 'erro');
        return;
    }

    const roupa = roupasDisponiveis.find((r) => r.id === roupaId);
    if (!roupa) return;

    const itemExistente = carrinho.find((item) => item.roupa_id === roupaId);
    const quantidadeNoCarrinho = itemExistente ? itemExistente.quantidade : 0;

    if (quantidadeNoCarrinho + quantidade > roupa.quantidade) {
        mostrarAlerta(`Estoque insuficiente. Disponivel: ${roupa.quantidade}.`, 'erro');
        return;
    }

    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        carrinho.push({ roupa_id: roupa.id, nome: roupa.nome, preco: roupa.preco, quantidade });
    }

    inputQuantidade.value = 1;
    renderizarCarrinho();
}

function removerDoCarrinho(roupaId) {
    carrinho = carrinho.filter((item) => item.roupa_id !== roupaId);
    renderizarCarrinho();
}

function renderizarCarrinho() {
    if (carrinho.length === 0) {
        carrinhoLista.innerHTML = '<p class="vazio">O carrinho esta vazio. Adicione pecas acima.</p>';
        carrinhoTotalValor.textContent = formatarMoeda(0);
        return;
    }

    carrinhoLista.innerHTML = carrinho.map((item) => `
        <div class="carrinho-item">
            <span>${item.quantidade}x ${item.nome}</span>
            <span style="display:flex; align-items:center; gap:.75rem;">
                ${formatarMoeda(item.preco * item.quantidade)}
                <button class="btn btn-sm btn-perigo" onclick="removerDoCarrinho(${item.roupa_id})">Remover</button>
            </span>
        </div>
    `).join('');

    const total = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
    carrinhoTotalValor.textContent = formatarMoeda(total);
}

async function finalizarVenda() {
    if (carrinho.length === 0) {
        mostrarAlerta('Adicione ao menos uma peca ao carrinho.', 'erro');
        return;
    }

    const payload = {
        cliente_id: selectCliente.value ? Number(selectCliente.value) : null,
        forma_pagamento: document.getElementById('venda-pagamento').value,
        itens: carrinho.map((item) => ({ roupa_id: item.roupa_id, quantidade: item.quantidade }))
    };

    try {
        await api.post('/vendas/salvar', payload);
        mostrarAlerta('Venda registrada com sucesso!');
        carrinho = [];
        renderizarCarrinho();
        await carregarDadosIniciais();
    } catch (erro) {
        mostrarAlerta(erro.message, 'erro');
    }
}

// ---------------------------------------------------------
// Historico de vendas
// ---------------------------------------------------------
function renderizarVendas() {
    if (vendasCache.length === 0) {
        listaVendas.innerHTML = '<tr><td colspan="7">Nenhuma venda registrada ainda.</td></tr>';
        return;
    }

    listaVendas.innerHTML = vendasCache.map((venda) => `
        <tr>
            <td data-rotulo="#">${venda.id}</td>
            <td data-rotulo="Cliente">${venda.cliente_nome || 'Nao identificado'}</td>
            <td data-rotulo="Data">${formatarData(venda.data_venda)}</td>
            <td data-rotulo="Pagamento">${venda.forma_pagamento}</td>
            <td data-rotulo="Status">
                <span class="badge ${venda.status === 'Cancelada' ? 'estoque-baixo' : ''}">${venda.status}</span>
            </td>
            <td data-rotulo="Total">${formatarMoeda(venda.total)}</td>
            <td data-rotulo="Acoes">
                <div class="linha-acoes">
                    <button class="btn btn-sm btn-fantasma" onclick="verDetalhesVenda(${venda.id})">Detalhes</button>
                    ${venda.status !== 'Cancelada'
                        ? `<button class="btn btn-sm btn-perigo" onclick="cancelarVenda(${venda.id})">Cancelar</button>`
                        : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

async function verDetalhesVenda(id) {
    try {
        const venda = await api.get(`/vendas/buscar/${id}`);
        detalhesVenda.innerHTML = `
            <p><strong>Cliente:</strong> ${venda.cliente_nome || 'Nao identificado'}</p>
            <p><strong>Data:</strong> ${formatarData(venda.data_venda)}</p>
            <p><strong>Pagamento:</strong> ${venda.forma_pagamento}</p>
            <p><strong>Status:</strong> ${venda.status}</p>
            <hr style="border: none; border-top: 1px dashed var(--linha); margin: 1rem 0;">
            ${venda.itens.map((item) => `
                <div class="carrinho-item">
                    <span>${item.quantidade}x ${item.roupa_nome}</span>
                    <span>${formatarMoeda(item.preco_unitario * item.quantidade)}</span>
                </div>
            `).join('')}
            <div class="carrinho-total">
                <span>Total</span>
                <span>${formatarMoeda(venda.total)}</span>
            </div>
        `;
        modalVenda.classList.add('aberto');
    } catch (erro) {
        mostrarAlerta(erro.message, 'erro');
    }
}

async function cancelarVenda(id) {
    const confirmar = confirm('Cancelar esta venda? As pecas voltarao para o estoque.');
    if (!confirmar) return;

    try {
        await api.delete(`/vendas/deletar/${id}`);
        mostrarAlerta('Venda cancelada.');
        await carregarDadosIniciais();
    } catch (erro) {
        mostrarAlerta(erro.message, 'erro');
    }
}

// ---------------------------------------------------------
// Eventos de UI
// ---------------------------------------------------------
document.getElementById('btn-add-item').addEventListener('click', adicionarAoCarrinho);
document.getElementById('btn-limpar-carrinho').addEventListener('click', () => {
    carrinho = [];
    renderizarCarrinho();
});
document.getElementById('btn-finalizar-venda').addEventListener('click', finalizarVenda);
document.getElementById('fechar-modal-venda').addEventListener('click', () => modalVenda.classList.remove('aberto'));
modalVenda.addEventListener('click', (evento) => {
    if (evento.target === modalVenda) modalVenda.classList.remove('aberto');
});

// ---------------------------------------------------------
// Inicializacao
// ---------------------------------------------------------
carregarDadosIniciais();
