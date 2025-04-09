import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import '../layout.css';


interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>☕ Break Time</h2>
        <nav>
          <Link to="/">📊 Dashboard</Link>
          <Link to="/categories">📂 Categorias</Link>
          <Link to="/products">📦 Produtos</Link>
          <Link to="/orders">📃 Pedidos</Link>
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
};

export default Layout;
