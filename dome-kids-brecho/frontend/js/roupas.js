// =========================================================
// roupas.js
// Toda a logica da pagina de CADASTRO DE ROUPAS.
// Responsavel por: listar, filtrar, cadastrar, editar e
// excluir pecas, consumindo a API em /roupas.
// =========================================================

let roupasCache = [];

const listaRoupas = document.getElementById('lista-roupas');
const modalRoupa = document.getElementById('modal-roupa');
const formRoupa = document.getElementById('form-roupa');
const tituloModal = document.getElementById('titulo-modal-roupa');
const filtroBusca = document.getElementById('filtro-busca');
const filtroCategoria = document.getElementById('filtro-categoria');

// ---------------------------------------------------------
// Carregamento e renderizacao
// ---------------------------------------------------------
async function carregarRoupas() {
    try {
        roupasCache = await api.get('/roupas/listar');
        renderizarRoupas();
    } catch (erro) {
        listaRoupas.innerHTML = '<p class="vazio">Nao foi possivel carregar as pecas. Verifique se o back-end esta rodando.</p>';
    }
}

function renderizarRoupas() {
    const termo = filtroBusca.value.trim().toLowerCase();
    const categoria = filtroCategoria.value;

    const filtradas = roupasCache.filter((roupa) => {
        const bateNome = roupa.nome.toLowerCase().includes(termo);
        const bateCategoria = !categoria || roupa.categoria === categoria;
        return bateNome && bateCategoria;
    });

    if (filtradas.length === 0) {
        listaRoupas.innerHTML = '<p class="vazio">Nenhuma peca encontrada. Cadastre a primeira peca do brecho!</p>';
        return;
    }

    listaRoupas.innerHTML = filtradas.map(roupaParaHtml).join('');
}

function roupaParaHtml(roupa) {
    const estoqueBaixo = roupa.quantidade <= 1;
    return `
        <article class="etiqueta">
            <h3>${escapar(roupa.nome)}</h3>
            <span class="preco">${formatarMoeda(roupa.preco)}</span>
            <div class="meta">
                <span class="badge">${escapar(roupa.categoria)}</span>
                <span class="badge tamanho">Tam. ${escapar(roupa.tamanho)}</span>
                <span class="badge condicao">${escapar(roupa.condicao)}</span>
                <span class="badge ${estoqueBaixo ? 'estoque-baixo' : ''}">${roupa.quantidade} em estoque</span>
            </div>
            ${roupa.descricao ? `<p class="descricao">${escapar(roupa.descricao)}</p>` : ''}
            <div class="acoes">
                <button class="btn btn-sm btn-fantasma" onclick="abrirEdicaoRoupa(${roupa.id})">Editar</button>
                <button class="btn btn-sm btn-perigo" onclick="excluirRoupa(${roupa.id})">Excluir</button>
            </div>
        </article>
    `;
}

function escapar(texto) {
    const div = document.createElement('div');
    div.textContent = texto ?? '';
    return div.innerHTML;
}

// ---------------------------------------------------------
// Modal (cadastro / edicao)
// ---------------------------------------------------------
function abrirModalRoupa() {
    modalRoupa.classList.add('aberto');
}

function fecharModalRoupa() {
    modalRoupa.classList.remove('aberto');
    formRoupa.reset();
    document.getElementById('roupa-id').value = '';
}

function abrirNovaRoupa() {
    tituloModal.textContent = 'Nova peca';
    formRoupa.reset();
    document.getElementById('roupa-id').value = '';
    abrirModalRoupa();
}

function abrirEdicaoRoupa(id) {
    const roupa = roupasCache.find((r) => r.id === id);
    if (!roupa) return;

    tituloModal.textContent = 'Editar peca';
    document.getElementById('roupa-id').value = roupa.id;
    document.getElementById('roupa-nome').value = roupa.nome;
    document.getElementById('roupa-categoria').value = roupa.categoria;
    document.getElementById('roupa-tamanho').value = roupa.tamanho;
    document.getElementById('roupa-cor').value = roupa.cor || '';
    document.getElementById('roupa-condicao').value = roupa.condicao;
    document.getElementById('roupa-preco').value = roupa.preco;
    document.getElementById('roupa-quantidade').value = roupa.quantidade;
    document.getElementById('roupa-descricao').value = roupa.descricao || '';

    abrirModalRoupa();
}

// ---------------------------------------------------------
// Envio do formulario (criar ou editar)
// ---------------------------------------------------------
formRoupa.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const id = document.getElementById('roupa-id').value;
    const payload = {
        nome: document.getElementById('roupa-nome').value.trim(),
        categoria: document.getElementById('roupa-categoria').value,
        tamanho: document.getElementById('roupa-tamanho').value.trim(),
        cor: document.getElementById('roupa-cor').value.trim(),
        condicao: document.getElementById('roupa-condicao').value,
        preco: parseFloat(document.getElementById('roupa-preco').value),
        quantidade: parseInt(document.getElementById('roupa-quantidade').value, 10),
        descricao: document.getElementById('roupa-descricao').value.trim()
    };

    try {
        if (id) {
            await api.put(`/roupas/editar/${id}`, payload);
            mostrarAlerta('Peca atualizada com sucesso!');
        } else {
            await api.post('/roupas/salvar', payload);
            mostrarAlerta('Peca cadastrada com sucesso!');
        }
        fecharModalRoupa();
        carregarRoupas();
    } catch (erro) {
        mostrarAlerta(erro.message, 'erro');
    }
});

async function excluirRoupa(id) {
    const roupa = roupasCache.find((r) => r.id === id);
    if (!roupa) return;

    const confirmar = confirm(`Deseja realmente excluir "${roupa.nome}"?`);
    if (!confirmar) return;

    try {
        await api.delete(`/roupas/deletar/${id}`);
        mostrarAlerta('Peca removida.');
        carregarRoupas();
    } catch (erro) {
        mostrarAlerta(erro.message, 'erro');
    }
}

// ---------------------------------------------------------
// Eventos de UI
// ---------------------------------------------------------
document.getElementById('btn-nova-roupa').addEventListener('click', abrirNovaRoupa);
document.getElementById('cancelar-roupa').addEventListener('click', fecharModalRoupa);
document.getElementById('fechar-modal-roupa').addEventListener('click', fecharModalRoupa);
modalRoupa.addEventListener('click', (evento) => {
    if (evento.target === modalRoupa) fecharModalRoupa();
});
filtroBusca.addEventListener('input', renderizarRoupas);
filtroCategoria.addEventListener('change', renderizarRoupas);

// ---------------------------------------------------------
// Inicializacao
// ---------------------------------------------------------
carregarRoupas();
