from flask import Blueprint, request, jsonify, render_template
from src.models.item import db, Item
from flask_cors import cross_origin

# Criar blueprint para as rotas de itens
item_bp = Blueprint('item', __name__)

@item_bp.route('/itens', methods=['GET'])
@cross_origin()
def listar_itens():
    """
    Retorna todos os itens da lista de compras
    """
    try:
        itens = Item.query.all()
        return jsonify([item.to_dict() for item in itens]), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@item_bp.route('/itens', methods=['POST'])
@cross_origin()
def adicionar_item():
    """
    Adiciona um novo item à lista de compras
    """
    try:
        dados = request.get_json()
        
        # Validar dados obrigatórios
        if not dados or 'nome' not in dados or 'categoria' not in dados:
            return jsonify({'erro': 'Nome e categoria são obrigatórios'}), 400
        
        # Criar novo item
        novo_item = Item(
            nome=dados['nome'].strip(),
            categoria=dados['categoria'].strip()
        )
        
        # Salvar no banco
        db.session.add(novo_item)
        db.session.commit()
        
        return jsonify(novo_item.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@item_bp.route('/itens/<int:item_id>', methods=['PUT'])
@cross_origin()
def atualizar_item(item_id):
    """
    Atualiza um item existente (quantidade, valor unitário, status de comprado)
    """
    try:
        item = Item.query.get_or_404(item_id)
        dados = request.get_json()
        
        if not dados:
            return jsonify({'erro': 'Dados não fornecidos'}), 400
        
        # Atualizar campos se fornecidos
        if 'quantidade' in dados:
            item.quantidade = float(dados['quantidade'])
        
        if 'valor_unitario' in dados:
            item.valor_unitario = float(dados['valor_unitario'])
        
        if 'comprado' in dados:
            item.comprado = bool(dados['comprado'])
        
        if 'nome' in dados:
            item.nome = dados['nome'].strip()
        
        if 'categoria' in dados:
            item.categoria = dados['categoria'].strip()
        
        # Salvar alterações
        db.session.commit()
        
        return jsonify(item.to_dict()), 200
        
    except ValueError as e:
        return jsonify({'erro': 'Valores numéricos inválidos'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@item_bp.route('/itens/<int:item_id>', methods=['DELETE'])
@cross_origin()
def deletar_item(item_id):
    """
    Remove um item da lista de compras
    """
    try:
        item = Item.query.get_or_404(item_id)
        db.session.delete(item)
        db.session.commit()
        
        return jsonify({'mensagem': 'Item removido com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@item_bp.route('/categorias', methods=['GET'])
@cross_origin()
def listar_categorias():
    """
    Retorna a lista de categorias disponíveis
    """
    try:
        categorias = Item.get_categorias()
        return jsonify(categorias), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@item_bp.route('/resumo', methods=['GET'])
@cross_origin()
def resumo_compras():
    """
    Retorna um resumo das compras (total geral, itens comprados, etc.)
    """
    try:
        itens = Item.query.all()
        
        total_geral = sum(item.valor_total for item in itens)
        total_comprados = sum(item.valor_total for item in itens if item.comprado)
        itens_comprados = len([item for item in itens if item.comprado])
        total_itens = len(itens)
        
        resumo = {
            'total_geral': total_geral,
            'total_comprados': total_comprados,
            'itens_comprados': itens_comprados,
            'total_itens': total_itens,
            'percentual_comprado': (itens_comprados / total_itens * 100) if total_itens > 0 else 0
        }
        
        return jsonify(resumo), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@item_bp.route('/limpar', methods=['DELETE'])
@cross_origin()
def limpar_lista():
    """
    Remove todos os itens da lista de compras
    """
    try:
        Item.query.delete()
        db.session.commit()
        
        return jsonify({'mensagem': 'Lista limpa com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

