// =========================================================
// clientes.js
// Toda a logica da pagina de CLIENTES.
// Responsavel por: listar, cadastrar, editar e excluir
// clientes, consumindo a API em /clientes.
// =========================================================

let clientesCache = [];

const listaClientes = document.getElementById('lista-clientes');
const modalCliente = document.getElementById('modal-cliente');
const formCliente = document.getElementById('form-cliente');
const tituloModalCliente = document.getElementById('titulo-modal-cliente');

async function carregarClientes() {
    try {
        clientesCache = await api.get('/clientes/listar');
        renderizarClientes();
    } catch (erro) {
        listaClientes.innerHTML = '<tr><td colspan="5">Nao foi possivel carregar os clientes. Verifique o back-end.</td></tr>';
    }
}

function renderizarClientes() {
    if (clientesCache.length === 0) {
        listaClientes.innerHTML = '<tr><td colspan="5">Nenhum cliente cadastrado ainda.</td></tr>';
        return;
    }

    listaClientes.innerHTML = clientesCache.map((cliente) => `
        <tr>
            <td data-rotulo="Nome">${escaparTexto(cliente.nome)}</td>
            <td data-rotulo="Telefone">${escaparTexto(cliente.telefone) || '-'}</td>
            <td data-rotulo="E-mail">${escaparTexto(cliente.email) || '-'}</td>
            <td data-rotulo="Cadastrado em">${formatarData(cliente.data_cadastro)}</td>
            <td data-rotulo="Acoes">
                <div class="linha-acoes">
                    <button class="btn btn-sm btn-fantasma" onclick="abrirEdicaoCliente(${cliente.id})">Editar</button>
                    <button class="btn btn-sm btn-perigo" onclick="excluirCliente(${cliente.id})">Excluir</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function escaparTexto(texto) {
    const div = document.createElement('div');
    div.textContent = texto ?? '';
    return div.innerHTML;
}

function abrirModalCliente() { modalCliente.classList.add('aberto'); }

function fecharModalCliente() {
    modalCliente.classList.remove('aberto');
    formCliente.reset();
    document.getElementById('cliente-id').value = '';
}

function abrirNovoCliente() {
    tituloModalCliente.textContent = 'Novo cliente';
    formCliente.reset();
    document.getElementById('cliente-id').value = '';
    abrirModalCliente();
}

function abrirEdicaoCliente(id) {
    const cliente = clientesCache.find((c) => c.id === id);
    if (!cliente) return;

    tituloModalCliente.textContent = 'Editar cliente';
    document.getElementById('cliente-id').value = cliente.id;
    document.getElementById('cliente-nome').value = cliente.nome;
    document.getElementById('cliente-telefone').value = cliente.telefone || '';
    document.getElementById('cliente-email').value = cliente.email || '';

    abrirModalCliente();
}

formCliente.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const id = document.getElementById('cliente-id').value;
    const payload = {
        nome: document.getElementById('cliente-nome').value.trim(),
        telefone: document.getElementById('cliente-telefone').value.trim(),
        email: document.getElementById('cliente-email').value.trim()
    };

    try {
        if (id) {
            await api.put(`/clientes/editar/${id}`, payload);
            mostrarAlerta('Cliente atualizado com sucesso!');
        } else {
            await api.post('/clientes/salvar', payload);
            mostrarAlerta('Cliente cadastrado com sucesso!');
        }
        fecharModalCliente();
        carregarClientes();
    } catch (erro) {
        mostrarAlerta(erro.message, 'erro');
    }
});

async function excluirCliente(id) {
    const cliente = clientesCache.find((c) => c.id === id);
    if (!cliente) return;

    const confirmar = confirm(`Deseja realmente excluir "${cliente.nome}"?`);
    if (!confirmar) return;

    try {
        await api.delete(`/clientes/deletar/${id}`);
        mostrarAlerta('Cliente removido.');
        carregarClientes();
    } catch (erro) {
        mostrarAlerta(erro.message, 'erro');
    }
}

document.getElementById('btn-novo-cliente').addEventListener('click', abrirNovoCliente);
document.getElementById('cancelar-cliente').addEventListener('click', fecharModalCliente);
document.getElementById('fechar-modal-cliente').addEventListener('click', fecharModalCliente);
modalCliente.addEventListener('click', (evento) => {
    if (evento.target === modalCliente) fecharModalCliente();
});

carregarClientes();
