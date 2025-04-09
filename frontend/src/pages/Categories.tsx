import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Categories.css';

interface Category {
  _id: string;
  name: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [editing, setEditing] = useState<number | null>(null);

  useEffect(() => {
    axios.get('http://localhost:3000/categories', { withCredentials: true })
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
        setCategories([]);
      });
  }, []);

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;

    if (editing !== null) {
      const oldCategory = categories[editing];
      const updated: Category = { ...oldCategory, name: newCategory.trim() };

      const categoriesUpdated = [...categories];
      categoriesUpdated[editing] = updated;
      setCategories(categoriesUpdated);

      const newObject = {
        name: newCategory
      };

      axios.put(`http://localhost:3000/categories/${oldCategory._id}`, newObject, { withCredentials: true })
        .then(() => {
          setEditing(null);
          setNewCategory('');
        })
        .catch(error => {
          console.error('Erro na requisição:', error);
        });
    } else {
      const newObject = {
        name: newCategory.trim()
      };

      axios.post('http://localhost:3000/categories', newObject, { withCredentials: true })
        .then(response => {
          const newCategorySalva: Category = response.data;
          setCategories(prev => [...prev, newCategorySalva]);
          setNewCategory('');
        })
        .catch(error => {
          console.error('Erro na requisição:', error);
        });
    }
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Deseja deletar essa categoria?')) {
      axios.delete(`http://localhost:3000/categories/${categories[index]._id}`, { withCredentials: true })
        .then(() => {
          setCategories(categories.filter((_, i) => i !== index));
        })
        .catch(error => {
          console.error('Erro na requisição:', error);
        });
    }
  };

  const handleEdit = (index: number) => {
    setNewCategory(categories[index].name);
    setEditing(index);
  };

  return (
    <div className="categories-container">
      <h1>Categorias</h1>

      <div className="categories-form">
        <input
          type="text"
          placeholder="Nome da categoria"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleAddCategory}>
          {editing !== null ? 'Atualizar' : 'Adicionar'}
        </button>
        {editing !== null && (
          <button onClick={() => {
            setNewCategory('');
            setEditing(null);
          }}>
            Cancelar
          </button>
        )}
      </div>

      <ul className="categories-list">
        {categories.map((cat, index) => (
          <li key={cat._id}>
            <span>{cat.name}</span>
            <div>
              <button onClick={() => handleEdit(index)}>Editar</button>
              <button onClick={() => handleDelete(index)} className="delete-btn">Deletar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
