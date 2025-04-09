import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Product {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  categoryIds?: string[];
  image?: string;
}

interface Order {
  _id: string;
  date: string;
  productIds: string[];
  total: number;
}

interface ChartData {
  name: string;
  pedidos: number;
}

const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filterProduct, setFilterProduct] = useState<string>('');
  const [filterPeriod, setFilterPeriod] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [chartType, setChartType] = useState<'mensal' | 'anual'>('mensal');
  const [chartMonth, setChartMonth] = useState<number>(new Date().getMonth());
  const [chartYear, setChartYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      const [ordersRes, productsRes] = await Promise.all([
        axios.get<Order[]>('http://localhost:3000/orders'),
        axios.get<Product[]>('http://localhost:3000/products'),
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    };

    fetchData();
  }, []);

  const filterOrders = (): Order[] => {
    return orders.filter((order) => {
      const orderDate = new Date(order.date);

      if (filterProduct) {
        const productNames = order.productIds.map(p => {
          const found = products.find(prod => prod._id === p);
          return found?.name;
        });
        if (!productNames.includes(filterProduct)) return false;
      }

      if (filterPeriod && selectedDate) {
        const selected = new Date(selectedDate);

        if (filterPeriod === 'dia') {
          if (orderDate.toDateString() !== selected.toDateString()) return false;
        }

        if (filterPeriod === 'mes') {
          if (
            orderDate.getMonth() !== selected.getMonth() ||
            orderDate.getFullYear() !== selected.getFullYear()
          ) return false;
        }

        if (filterPeriod === 'ano') {
          if (orderDate.getFullYear() !== selected.getFullYear()) return false;
        }

        if (filterPeriod === 'semana') {
          const weekStart = new Date(selected);
          const weekEnd = new Date(selected);
          weekEnd.setDate(weekStart.getDate() + 6);

          if (orderDate < weekStart || orderDate > weekEnd) return false;
        }
      }

      return true;
    });
  };

  const filteredOrders = filterOrders();
  const quantityTotal = filteredOrders.length;
  const revenueTotal = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const valueAverage = quantityTotal > 0 ? (revenueTotal / quantityTotal).toFixed(2) : '0';

  const getMonthlyData = (): ChartData[] => {
    const daysInMonth = new Date(chartYear, chartMonth + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, day) => {
      const count = orders.filter(order => {
        const d = new Date(order.date);
        return d.getFullYear() === chartYear && d.getMonth() === chartMonth && d.getDate() === day + 1;
      }).length;
      return { name: `${day + 1}`, pedidos: count };
    });
  };

  const getYearlyData = (): ChartData[] => {
    return Array.from({ length: 12 }, (_, month) => {
      const count = orders.filter(order => {
        const d = new Date(order.date);
        return d.getFullYear() === chartYear && d.getMonth() === month;
      }).length;
      return { name: `${month + 1}`, pedidos: count };
    });
  };

  const chartData: ChartData[] = chartType === 'mensal' ? getMonthlyData() : getYearlyData();

  const availableYears = [...new Set(orders.map(o => new Date(o.date).getFullYear()))].sort();

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      <div className="filters">
        <select value={filterProduct} onChange={(e) => setFilterProduct(e.target.value)}>
          <option value="">Filtrar por Produto</option>
          {products.map((p) => (
            <option key={p._id} value={p.name}>{p.name}</option>
          ))}
        </select>

        <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)}>
          <option value="">Todos os períodos</option>
          <option value="dia">Dia</option>
          <option value="semana">Semana</option>
          <option value="mes">Mês</option>
          <option value="ano">Ano</option>
        </select>

        {filterPeriod && (
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        )}
      </div>

      <div className="metrics">
        <div className="card">
          <h3>Pedidos</h3>
          <p>{quantityTotal}</p>
        </div>
        <div className="card">
          <h3>Receita Total</h3>
          <p>R$ {revenueTotal.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Valor Médio</h3>
          <p>R$ {valueAverage}</p>
        </div>
      </div>

      <div className="filters">
        <select value={chartType} onChange={(e) => setChartType(e.target.value as 'mensal' | 'anual')}>
          <option value="mensal">Gráfico do Mês</option>
          <option value="anual">Gráfico do Ano</option>
        </select>

        {chartType === 'mensal' && (
          <select value={chartMonth} onChange={(e) => setChartMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>{i + 1}</option>
            ))}
          </select>
        )}

        <select value={chartYear} onChange={(e) => setChartYear(Number(e.target.value))}>
          {availableYears.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div style={{ width: '100%', maxWidth: 800, height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="pedidos" fill="#c08552" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
