# Lista de Compras - Aplicação Web Flask

Uma aplicação web moderna para gerenciar listas de compras, desenvolvida com Flask (Python) e Bootstrap.

## Funcionalidades

### 🛒 Tela de Criação da Lista
- Adicionar itens à lista de compras
- Categorizar itens (Frutas e Verduras, Carnes e Peixes, Laticínios, etc.)
- Visualizar todos os itens adicionados
- Remover itens individuais
- Limpar toda a lista

### 🏪 Tela de Uso no Mercado
- Visualizar itens para comprar
- Marcar itens como comprados
- Inserir quantidade comprada
- Inserir valor unitário
- Cálculo automático do valor total por item
- Resumo da compra em tempo real:
  - Total de itens comprados
  - Valor total da compra
  - Progresso da compra (%)

## Tecnologias Utilizadas

- **Backend**: Python 3.11 + Flask
- **Banco de Dados**: SQLite
- **Frontend**: HTML5 + CSS3 + JavaScript
- **Framework CSS**: Bootstrap 5.3
- **Ícones**: Bootstrap Icons

## Estrutura do Projeto

```
lista-compras/
├── src/
│   ├── models/
│   │   └── item.py          # Modelo de dados dos itens
│   ├── routes/
│   │   └── item.py          # Rotas da API REST
│   ├── static/
│   │   ├── index.html       # Interface principal
│   │   └── app.js           # JavaScript da aplicação
│   ├── database/
│   │   └── app.db           # Banco de dados SQLite
│   └── main.py              # Arquivo principal do Flask
├── venv/                    # Ambiente virtual Python
├── requirements.txt         # Dependências Python
└── README.md               # Este arquivo
```

## Como Executar

### Pré-requisitos
- Python 3.11 ou superior
- pip (gerenciador de pacotes Python)

### Passos para Execução

1. **Clone ou baixe o projeto**
   ```bash
   cd lista-compras
   ```

2. **Ative o ambiente virtual**
   ```bash
   source venv/bin/activate
   ```

3. **Execute a aplicação**
   ```bash
   python src/main.py
   ```

4. **Acesse no navegador**
   ```
   http://localhost:5000
   ```

### Parar a Aplicação
Para parar o servidor, pressione `Ctrl+C` no terminal.

## API REST

A aplicação possui uma API REST completa para gerenciar os itens:

### Endpoints Disponíveis

- `GET /api/itens` - Listar todos os itens
- `POST /api/itens` - Adicionar novo item
- `PUT /api/itens/<id>` - Atualizar item existente
- `DELETE /api/itens/<id>` - Remover item
- `GET /api/categorias` - Listar categorias disponíveis
- `GET /api/resumo` - Obter resumo das compras
- `DELETE /api/limpar` - Limpar toda a lista

### Exemplo de Uso da API

```javascript
// Adicionar um item
fetch('/api/itens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        nome: 'Leite integral',
        categoria: 'Laticínios'
    })
});

// Atualizar quantidade e valor
fetch('/api/itens/1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        quantidade: 2,
        valor_unitario: 4.50,
        comprado: true
    })
});
```

## Características Técnicas

### Backend
- **Flask**: Framework web minimalista e flexível
- **SQLAlchemy**: ORM para gerenciamento do banco de dados
- **Flask-CORS**: Suporte a requisições cross-origin
- **SQLite**: Banco de dados leve e sem configuração

### Frontend
- **Design Responsivo**: Funciona em desktop e mobile
- **Interface Moderna**: Gradientes, sombras e animações
- **Interações Dinâmicas**: Cálculos em tempo real
- **UX Intuitiva**: Navegação por abas e feedback visual

### Funcionalidades Avançadas
- **Persistência**: Dados salvos automaticamente no SQLite
- **Cálculos Dinâmicos**: Valores atualizados em tempo real
- **Validação**: Campos obrigatórios e tipos de dados
- **Feedback Visual**: Notificações e estados de loading
- **Responsividade**: Layout adaptável para diferentes telas

## Personalização

### Adicionar Novas Categorias
Edite o método `get_categorias()` em `src/models/item.py`:

```python
@staticmethod
def get_categorias():
    return [
        'Frutas e Verduras',
        'Carnes e Peixes',
        'Laticínios',
        'Padaria',
        'Bebidas',
        'Limpeza',
        'Higiene',
        'Congelados',
        'Enlatados',
        'Outros',
        'Nova Categoria'  # Adicione aqui
    ]
```

### Modificar Cores e Estilos
Edite o CSS no arquivo `src/static/index.html` na seção `<style>`.

## Solução de Problemas

### Erro de Porta em Uso
Se a porta 5000 estiver em uso, modifique em `src/main.py`:
```python
app.run(host='0.0.0.0', port=5001, debug=True)  # Mude para 5001
```

### Problemas com Banco de Dados
O banco SQLite é criado automaticamente. Se houver problemas, delete o arquivo `src/database/app.db` e reinicie a aplicação.

### Dependências em Falta
Se houver erros de importação, reinstale as dependências:
```bash
pip install -r requirements.txt
```

## Contribuição

Este projeto foi desenvolvido como uma aplicação completa de lista de compras. Sinta-se à vontade para:

- Adicionar novas funcionalidades
- Melhorar o design
- Otimizar o código
- Corrigir bugs

## Licença

Este projeto é de código aberto e pode ser usado livremente para fins educacionais e comerciais.

