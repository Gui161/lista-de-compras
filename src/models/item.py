from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Item(db.Model):
    """
    Modelo para representar um item da lista de compras
    """
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)  # Nome do item
    categoria = db.Column(db.String(50), nullable=False)  # Categoria do item
    quantidade = db.Column(db.Float, default=0.0)  # Quantidade comprada
    valor_unitario = db.Column(db.Float, default=0.0)  # Valor unitário do item
    comprado = db.Column(db.Boolean, default=False)  # Se o item foi comprado
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)  # Data de criação
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # Data de atualização

    def __repr__(self):
        return f'<Item {self.nome}>'

    @property
    def valor_total(self):
        """
        Calcula o valor total do item (quantidade × valor unitário)
        """
        return self.quantidade * self.valor_unitario

    def to_dict(self):
        """
        Converte o objeto Item para um dicionário
        """
        return {
            'id': self.id,
            'nome': self.nome,
            'categoria': self.categoria,
            'quantidade': self.quantidade,
            'valor_unitario': self.valor_unitario,
            'valor_total': self.valor_total,
            'comprado': self.comprado,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'data_atualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None
        }

    @staticmethod
    def get_categorias():
        """
        Retorna uma lista das categorias mais comuns para lista de compras
        """
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
            'Outros'
        ]

