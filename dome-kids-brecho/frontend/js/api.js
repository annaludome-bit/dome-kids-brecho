// =========================================================
// api.js
// Camada unica de comunicacao com o back-end.
// Todas as paginas (roupas.js, clientes.js, vendas.js) usam
// estas funcoes para conversar com a API.
// =========================================================

const API_BASE_URL = 'http://localhost:3000';

/**
 * Faz uma requisicao generica para a API e trata erros.
 */
async function apiFetch(caminho, opcoes = {}) {
    const resposta = await fetch(`${API_BASE_URL}${caminho}`, {
        headers: { 'Content-Type': 'application/json' },
        ...opcoes
    });

    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
        throw new Error(dados.erro || 'Ocorreu um erro ao falar com o servidor.');
    }

    return dados;
}

const api = {
    get: (caminho) => apiFetch(caminho),
    post: (caminho, corpo) => apiFetch(caminho, { method: 'POST', body: JSON.stringify(corpo) }),
    put: (caminho, corpo) => apiFetch(caminho, { method: 'PUT', body: JSON.stringify(corpo) }),
    delete: (caminho) => apiFetch(caminho, { method: 'DELETE' })
};

/**
 * Exibe um alerta (toast) no canto da tela.
 */
function mostrarAlerta(mensagem, tipo = 'sucesso') {
    let alerta = document.getElementById('alerta-global');

    if (!alerta) {
        alerta = document.createElement('div');
        alerta.id = 'alerta-global';
        document.body.appendChild(alerta);
    }

    alerta.textContent = mensagem;
    alerta.className = `alerta ${tipo} mostrar`;

    clearTimeout(alerta._timeout);
    alerta._timeout = setTimeout(() => {
        alerta.classList.remove('mostrar');
    }, 3200);
}

/**
 * Formata um numero para moeda brasileira (R$).
 */
function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Formata uma data ISO/SQL para o padrao dd/mm/aaaa hh:mm.
 */
function formatarData(dataTexto) {
    if (!dataTexto) return '-';
    const data = new Date(dataTexto.replace(' ', 'T'));
    if (Number.isNaN(data.getTime())) return dataTexto;
    return data.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
