import React, { useState, useEffect, ChangeEvent } from 'react';
import './Products.css';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  categoryIds: string[];
  imageUrl: string;
}

interface Category {
  _id: string;
  name: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    axios.get('http://localhost:3000/products', { withCredentials: true })
      .then(response => setProducts(response.data))
      .catch(error => {
        console.error('Erro na requisição de produtos:', error);
        setProducts([]);
      });

    axios.get('http://localhost:3000/categories', { withCredentials: true })
      .then(response => setCategories(response.data))
      .catch(error => {
        console.error('Erro na requisição de categorias:', error);
        setCategories([]);
      });
  }, []);

  const getCategoryName = (index: number): string => {
    const product = products[index];
    if (!product || !Array.isArray(product.categoryIds)) return '';

    const nomes = product.categoryIds
      .map(id => categories.find(cat => cat._id === id)?.name)
      .filter((name): name is string => Boolean(name));

    return nomes.join(', ');
  };

  const handleAddProduct = () => {
    if (!name.trim() || !description.trim() || !price || selectedCategories.length === 0 || !imageUrl.trim()) return;

    const newProduct = {
      name,
      description,
      price: parseFloat(price),
      categoryIds: selectedCategories,
      imageUrl
    };

    const clearFields = () => {
      setName('');
      setDescription('');
      setPrice('');
      setSelectedCategories([]);
      setImageUrl('');
    };

    if (editingIndex !== null) {
      const oldProduct = products[editingIndex];
      const updatedProduct = { ...oldProduct, ...newProduct };

      const updatedProducts = [...products];
      updatedProducts[editingIndex] = updatedProduct;
      setProducts(updatedProducts);

      axios.put(`http://localhost:3000/products/${oldProduct._id}`, newProduct, { withCredentials: true })
        .then(() => {
          setEditingIndex(null);
          clearFields();
        })
        .catch(error => {
          console.error('Erro ao atualizar produto:', error);
        });

    } else {
      axios.post('http://localhost:3000/products', newProduct, { withCredentials: true })
        .then(response => {
          setProducts(prev => [...prev, response.data]);
          clearFields();
        })
        .catch(error => {
          console.error('Erro ao adicionar produto:', error);
        });
    }
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Deseja deletar este produto?')) {
      const productId = products[index]._id;
      axios.delete(`http://localhost:3000/products/${productId}`, { withCredentials: true })
        .then(() => {
          setProducts(products.filter((_, i) => i !== index));
        })
        .catch(error => {
          console.error('Erro ao deletar produto:', error);
        });
    }
  };

  const handleEdit = (index: number) => {
    const produto = products[index];
    setName(produto.name);
    setDescription(produto.description);
    setPrice(produto.price.toString());
    setSelectedCategories(produto.categoryIds);
    setImageUrl(produto.imageUrl);
    setEditingIndex(index);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedCategories(prev =>
      prev.includes(value)
        ? prev.filter(id => id !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="products-container">
      <h1>Produtos</h1>

      <div className="product-form">
        <input type="text" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
        <textarea placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} />
        <input type="number" placeholder="Preço" value={price} onChange={e => setPrice(e.target.value)} />

        <div className="checkbox-group">
          {categories.map((cat, i) => (
            <label key={i}>
              <input
                type="checkbox"
                value={cat._id}
                checked={selectedCategories.includes(cat._id)}
                onChange={handleCheckboxChange}
              />
              {cat.name}
            </label>
          ))}
        </div>

        <input type="text" placeholder="URL da Imagem" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />

        <button onClick={handleAddProduct}>
          {editingIndex !== null ? 'Atualizar' : 'Adicionar Produto'}
        </button>
      </div>

      <ul className="product-list">
        {products.map((p, i) => (
          <li key={i}>
            <img src={p.imageUrl} alt={p.name} />
            <div>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <p><strong>R$</strong> {parseFloat(p.price.toString()).toFixed(2)}</p>
              <p>Categoria: {getCategoryName(i)}</p>
              <button onClick={() => handleEdit(i)}>Editar</button>
              <button onClick={() => handleDelete(i)} className="delete-btn">Deletar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
