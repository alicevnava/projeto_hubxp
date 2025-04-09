# ☕ Break Time - Sistema de Cafeteria

Bem-vindo ao **Break Time**, um sistema completo de gerenciamento para cafeterias, desenvolvido como projeto fullstack utilizando as melhores tecnologias modernas.

# 📁 Estrutura do Projeto
projeto_hubxp
├── backend/        # API RESTful com NestJS e MongoDB
├── frontend/       # Interface web com ReactJS
├── screenshots/    # Demonstrativo das telas
└── README.md       # Documentação do projeto
## 🛠️ Tecnologias Utilizadas

- **Frontend**: React, TypeScript
- **Backend**: NestJS
- **Banco de Dados**: MongoDB
- **Estilo e Design**: CSS customizado com base em paletas do [Coolors](https://coolors.co/), referências visuais do [Pinterest](https://pinterest.com) e imagens do [Unsplash](https://unsplash.com)

## 📚 Funcionalidades

### 📊 Dashboard
- Exibe dados dos pedidos com métricas (quantidade, receita total, valor médio)
- Filtros por produto, período (diário, semanal, mensal) e seleção por data
- Gráficos com visualização por mês (dias com pedidos) e por ano (meses com pedidos)

### 🏷️ Categorias
- CRUD de categorias
- Interface simples para adicionar, visualizar e excluir categorias

### 📦 Produtos
- CRUD de produtos
- Associação de múltiplas categorias a um produto
- Upload e exibição de imagens dos produtos

### 📋 Pedidos
- CRUD de pedidos
- Associação de produtos aos pedidos
- Registro automático de data e cálculo do valor total

## 📷 Telas do Projeto

![Tela de Categorias](./projeto_hubxp-master/screenshots/categorias.jpeg)
![Tela de Dashboard](./projeto_hubxp-master/screenshots/dashboard.jepg)
![Tela de Pedidos](./projeto_hubxp-master/screenshots/pedidos.jpeg)
![Tela de Produtos](./projeto_hubxp-master/screenshots/produtos.jepg)
![Sidebar](./projeto_hubxp-master/screenshots/sidebar.jepg)


## 🚀 Como Executar

🔧 Backend

```bash
cd backend
npm install
npm run start:dev
O backend estará rodando em: http://localhost:3000 

🎨 Frontend

```bash
cd frontend
npm install
npm run dev
O frontend estará rodando em: http://localhost:5173





