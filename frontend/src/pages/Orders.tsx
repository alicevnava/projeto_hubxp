import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  price: string;
}

interface Order {
  _id?: string;
  date: string;
  productIds: string[];
  total: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [date, setDate] = useState('');
  const [productsSelected, setSelectedProducts] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    axios.get('http://localhost:3000/orders', { withCredentials: true })
      .then(response => setOrders(response.data))
      .catch(error => {
        console.error('Erro na requisição de pedidos:', error);
        setOrders([]);
      });

    axios.get('http://localhost:3000/products', { withCredentials: true })
      .then(response => setProducts(response.data))
      .catch(error => {
        console.error('Erro na requisição de produtos:', error);
        setProducts([]);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const calculateTotal = (): string => {
    return productsSelected.reduce((total, name) => {
      const product = products.find(p => p.name === name);
      return total + (product ? parseFloat(product.price) : 0);
    }, 0).toFixed(2);
  };

  const handleAddOrder = () => {
    if (!date.trim() || productsSelected.length === 0) return;

    const newOrder: Order = {
      date,
      productIds: products
        .filter((p) => productsSelected.includes(p.name))
        .map((p) => p._id),
      total: calculateTotal()
    };

    if (editingIndex !== null) {
      const oldOrder = orders[editingIndex];
      const updatedOrders = [...orders];
      updatedOrders[editingIndex] = { ...newOrder, _id: oldOrder._id };
      setOrders(updatedOrders);

      axios.put(`http://localhost:3000/orders/${oldOrder._id}`, newOrder, { withCredentials: true })
        .then(() => {
          setEditingIndex(null);
          setDate('');
          setSelectedProducts([]);
        })
        .catch(error => {
          console.error('Erro na requisição:', error);
        });

    } else {
      axios.post('http://localhost:3000/orders', newOrder, { withCredentials: true })
        .then(response => {
          setOrders(prev => [...prev, response.data]);
          setDate('');
          setSelectedProducts([]);
        })
        .catch(error => {
          console.error('Erro na requisição:', error);
        });
    }
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Deseja deletar este pedido?')) {
      const orderId = orders[index]._id;
      if (!orderId) return;

      axios.delete(`http://localhost:3000/orders/${orderId}`, { withCredentials: true })
        .then(() => {
          setOrders(orders.filter((_, i) => i !== index));
        })
        .catch(error => {
          console.error('Erro na requisição:', error);
        });
    }
  };

  const handleEdit = (index: number) => {
    const order = orders[index];
    setDate(order.date.slice(0, 10));

    const nomesProdutos = order.productIds
      .map(id => products.find(p => p._id === id)?.name)
      .filter((name): name is string => Boolean(name));

    setSelectedProducts(nomesProdutos);
    setEditingIndex(index);
  };

  const toggleProduto = (productNome: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productNome)
        ? prev.filter((name) => name !== productNome)
        : [...prev, productNome]
    );
  };

  const getProductNames = (productIds: string[]): string => {
    const nomes = productIds
      .map(id => products.find(prod => prod._id === id)?.name)
      .filter((name): name is string => Boolean(name));

    return nomes.join(', ');
  };

  return (
    <div className="orders-container">
      <h1>Pedidos</h1>

      <div className="order-form">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="products-checkboxes">
          {products.map((p, i) => (
            <label key={i}>
              <input
                type="checkbox"
                checked={productsSelected.includes(p.name)}
                onChange={() => toggleProduto(p.name)}
              />
              {p.name} (R$ {parseFloat(p.price).toFixed(2)})
            </label>
          ))}
        </div>

        <p><strong>Total:</strong> R$ {calculateTotal()}</p>

        <button onClick={handleAddOrder}>
          {editingIndex !== null ? 'Atualizar' : 'Adicionar Pedido'}
        </button>
      </div>

      <ul className="order-list">
        {orders.map((order, i) => (
          <li key={i}>
            <p><strong>Data:</strong> {new Date(order.date).toLocaleDateString()}</p>
            <p><strong>Produtos:</strong> {getProductNames(order.productIds)}</p>
            <p><strong>Total:</strong> R$ {order.total}</p>
            <button onClick={() => handleEdit(i)}>Editar</button>
            <button onClick={() => handleDelete(i)} className="delete-btn">Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
