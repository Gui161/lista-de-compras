/**
 * Lista de Compras - JavaScript
 * Funcionalidades dinâmicas para a aplicação de lista de compras
 */

// Configuração da API
const API_BASE_URL = '/api';

// Estado da aplicação
let itens = [];
let categorias = [];

// Elementos DOM
const formAdicionarItem = document.getElementById('formAdicionarItem');
const nomeItemInput = document.getElementById('nomeItem');
const categoriaItemSelect = document.getElementById('categoriaItem');
const listaItensContainer = document.getElementById('listaItens');
const listaVaziaDiv = document.getElementById('listaVazia');
const itensMercadoContainer = document.getElementById('itensMercado');
const mercadoVazioDiv = document.getElementById('mercadoVazio');
const btnLimparLista = document.getElementById('btnLimparLista');

// Elementos do resumo
const itensCompradosSpan = document.getElementById('itensComprados');
const totalItensSpan = document.getElementById('totalItens');
const totalGeralSpan = document.getElementById('totalGeral');
const progressoComprasDiv = document.getElementById('progressoCompras');
const percentualCompradoSpan = document.getElementById('percentualComprado');

// Loading spinner
const loadingDiv = document.querySelector('.loading');

/**
 * Inicialização da aplicação
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Lista de Compras - Aplicação iniciada');
    
    // Carregar categorias
    carregarCategorias();
    
    // Carregar itens
    carregarItens();
    
    // Event listeners
    formAdicionarItem.addEventListener('submit', adicionarItem);
    btnLimparLista.addEventListener('click', limparLista);
    
    // Event listener para mudança de aba
    document.getElementById('mercado-tab').addEventListener('click', function() {
        carregarItensMercado();
        atualizarResumo();
    });
});

/**
 * Funções de utilidade
 */

// Mostrar loading
function mostrarLoading() {
    loadingDiv.style.display = 'block';
}

// Esconder loading
function esconderLoading() {
    loadingDiv.style.display = 'none';
}

// Formatar valor monetário
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

// Mostrar notificação
function mostrarNotificacao(mensagem, tipo = 'success') {
    // Criar elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
    notificacao.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notificacao.innerHTML = `
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notificacao);
    
    // Remover após 3 segundos
    setTimeout(() => {
        if (notificacao.parentNode) {
            notificacao.remove();
        }
    }, 3000);
}

/**
 * Funções da API
 */

// Carregar categorias
async function carregarCategorias() {
    try {
        const response = await fetch(`${API_BASE_URL}/categorias`);
        if (!response.ok) throw new Error('Erro ao carregar categorias');
        
        categorias = await response.json();
        
        // Preencher select de categorias
        categoriaItemSelect.innerHTML = '<option value="">Selecione uma categoria</option>';
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            categoriaItemSelect.appendChild(option);
        });
        
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        mostrarNotificacao('Erro ao carregar categorias', 'danger');
    }
}

// Carregar itens
async function carregarItens() {
    try {
        mostrarLoading();
        
        const response = await fetch(`${API_BASE_URL}/itens`);
        if (!response.ok) throw new Error('Erro ao carregar itens');
        
        itens = await response.json();
        renderizarListaItens();
        
    } catch (error) {
        console.error('Erro ao carregar itens:', error);
        mostrarNotificacao('Erro ao carregar itens', 'danger');
    } finally {
        esconderLoading();
    }
}

// Adicionar item
async function adicionarItem(event) {
    event.preventDefault();
    
    const nome = nomeItemInput.value.trim();
    const categoria = categoriaItemSelect.value;
    
    if (!nome || !categoria) {
        mostrarNotificacao('Por favor, preencha todos os campos', 'warning');
        return;
    }
    
    try {
        mostrarLoading();
        
        const response = await fetch(`${API_BASE_URL}/itens`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, categoria })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || 'Erro ao adicionar item');
        }
        
        const novoItem = await response.json();
        itens.push(novoItem);
        
        // Limpar formulário
        formAdicionarItem.reset();
        
        // Atualizar interface
        renderizarListaItens();
        mostrarNotificacao('Item adicionado com sucesso!');
        
    } catch (error) {
        console.error('Erro ao adicionar item:', error);
        mostrarNotificacao(error.message, 'danger');
    } finally {
        esconderLoading();
    }
}

// Atualizar item
async function atualizarItem(itemId, dados) {
    try {
        const response = await fetch(`${API_BASE_URL}/itens/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || 'Erro ao atualizar item');
        }
        
        const itemAtualizado = await response.json();
        
        // Atualizar item no array local
        const index = itens.findIndex(item => item.id === itemId);
        if (index !== -1) {
            itens[index] = itemAtualizado;
        }
        
        return itemAtualizado;
        
    } catch (error) {
        console.error('Erro ao atualizar item:', error);
        mostrarNotificacao(error.message, 'danger');
        throw error;
    }
}

// Deletar item
async function deletarItem(itemId) {
    if (!confirm('Tem certeza que deseja remover este item?')) {
        return;
    }
    
    try {
        mostrarLoading();
        
        const response = await fetch(`${API_BASE_URL}/itens/${itemId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || 'Erro ao deletar item');
        }
        
        // Remover item do array local
        itens = itens.filter(item => item.id !== itemId);
        
        // Atualizar interface
        renderizarListaItens();
        carregarItensMercado();
        atualizarResumo();
        
        mostrarNotificacao('Item removido com sucesso!');
        
    } catch (error) {
        console.error('Erro ao deletar item:', error);
        mostrarNotificacao(error.message, 'danger');
    } finally {
        esconderLoading();
    }
}

// Limpar lista
async function limparLista() {
    if (!confirm('Tem certeza que deseja limpar toda a lista?')) {
        return;
    }
    
    try {
        mostrarLoading();
        
        const response = await fetch(`${API_BASE_URL}/limpar`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || 'Erro ao limpar lista');
        }
        
        itens = [];
        renderizarListaItens();
        carregarItensMercado();
        atualizarResumo();
        
        mostrarNotificacao('Lista limpa com sucesso!');
        
    } catch (error) {
        console.error('Erro ao limpar lista:', error);
        mostrarNotificacao(error.message, 'danger');
    } finally {
        esconderLoading();
    }
}

/**
 * Funções de renderização
 */

// Renderizar lista de itens (tela de criação)
function renderizarListaItens() {
    if (itens.length === 0) {
        listaItensContainer.style.display = 'none';
        listaVaziaDiv.style.display = 'block';
        return;
    }
    
    listaItensContainer.style.display = 'block';
    listaVaziaDiv.style.display = 'none';
    
    listaItensContainer.innerHTML = '';
    
    itens.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'col-md-6 col-lg-4 mb-3';
        itemDiv.innerHTML = `
            <div class="card item-card fade-in">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="card-title mb-0">${item.nome}</h6>
                        <div class="item-actions">
                            <button class="btn btn-outline-danger btn-sm" onclick="deletarItem(${item.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                    <span class="badge bg-secondary">${item.categoria}</span>
                    ${item.comprado ? '<span class="badge bg-success ms-1">Comprado</span>' : ''}
                </div>
            </div>
        `;
        listaItensContainer.appendChild(itemDiv);
    });
}

// Carregar e renderizar itens para o mercado
function carregarItensMercado() {
    if (itens.length === 0) {
        itensMercadoContainer.style.display = 'none';
        mercadoVazioDiv.style.display = 'block';
        return;
    }
    
    itensMercadoContainer.style.display = 'block';
    mercadoVazioDiv.style.display = 'none';
    
    itensMercadoContainer.innerHTML = '';
    
    itens.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'col-md-6 mb-3';
        itemDiv.innerHTML = `
            <div class="card item-card ${item.comprado ? 'comprado' : ''} fade-in">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <h6 class="card-title mb-1">${item.nome}</h6>
                            <span class="badge bg-secondary">${item.categoria}</span>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" 
                                   id="comprado_${item.id}" 
                                   ${item.comprado ? 'checked' : ''}
                                   onchange="marcarComprado(${item.id}, this.checked)">
                            <label class="form-check-label" for="comprado_${item.id}">
                                Comprado
                            </label>
                        </div>
                    </div>
                    
                    <div class="row g-2">
                        <div class="col-6">
                            <label class="form-label small">Quantidade</label>
                            <input type="number" class="form-control form-control-sm" 
                                   value="${item.quantidade || ''}" 
                                   placeholder="0"
                                   step="0.01"
                                   onchange="atualizarQuantidade(${item.id}, this.value)">
                        </div>
                        <div class="col-6">
                            <label class="form-label small">Valor Unitário</label>
                            <input type="number" class="form-control form-control-sm" 
                                   value="${item.valor_unitario || ''}" 
                                   placeholder="0,00"
                                   step="0.01"
                                   onchange="atualizarValorUnitario(${item.id}, this.value)">
                        </div>
                    </div>
                    
                    <div class="mt-3 text-end">
                        <strong>Total: ${formatarMoeda(item.valor_total || 0)}</strong>
                    </div>
                </div>
            </div>
        `;
        itensMercadoContainer.appendChild(itemDiv);
    });
}

/**
 * Funções de interação
 */

// Marcar item como comprado
async function marcarComprado(itemId, comprado) {
    try {
        await atualizarItem(itemId, { comprado });
        carregarItensMercado();
        atualizarResumo();
    } catch (error) {
        // Reverter checkbox em caso de erro
        const checkbox = document.getElementById(`comprado_${itemId}`);
        if (checkbox) {
            checkbox.checked = !comprado;
        }
    }
}

// Atualizar quantidade
async function atualizarQuantidade(itemId, quantidade) {
    try {
        const valor = parseFloat(quantidade) || 0;
        await atualizarItem(itemId, { quantidade: valor });
        carregarItensMercado();
        atualizarResumo();
    } catch (error) {
        // Recarregar em caso de erro
        carregarItensMercado();
    }
}

// Atualizar valor unitário
async function atualizarValorUnitario(itemId, valorUnitario) {
    try {
        const valor = parseFloat(valorUnitario) || 0;
        await atualizarItem(itemId, { valor_unitario: valor });
        carregarItensMercado();
        atualizarResumo();
    } catch (error) {
        // Recarregar em caso de erro
        carregarItensMercado();
    }
}

// Atualizar resumo da compra
function atualizarResumo() {
    const itensComprados = itens.filter(item => item.comprado).length;
    const totalItens = itens.length;
    const totalGeral = itens.reduce((total, item) => total + (item.valor_total || 0), 0);
    const percentual = totalItens > 0 ? (itensComprados / totalItens) * 100 : 0;
    
    // Atualizar elementos
    itensCompradosSpan.textContent = itensComprados;
    totalItensSpan.textContent = totalItens;
    totalGeralSpan.textContent = formatarMoeda(totalGeral);
    progressoComprasDiv.style.width = `${percentual}%`;
    percentualCompradoSpan.textContent = `${Math.round(percentual)}% concluído`;
}

// Expor funções globalmente para uso nos event handlers inline
window.deletarItem = deletarItem;
window.marcarComprado = marcarComprado;
window.atualizarQuantidade = atualizarQuantidade;
window.atualizarValorUnitario = atualizarValorUnitario;

