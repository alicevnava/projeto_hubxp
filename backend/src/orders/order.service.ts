import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/orders.schema';

@Injectable()
export class OrderService {
    constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

    async getOrders() {
        return await this.orderModel.find().exec();
    }

    async getOrderById(id : string) {
        return await this.orderModel.findById(id).exec();
    }

    async createOrder(orderData: Partial <Order>) {
        return await new this.orderModel(orderData).save();
    }

    async deleteOrder(id: string) {
        return await this.orderModel.deleteOne({_id: id}).exec();
    }

    async updateOrder(id: string, updateOrder: Partial<Order>): Promise<Order |null>{
        return await this.orderModel.findByIdAndUpdate(id, updateOrder, {new:true}).exec();
    }

    async getDashboardData(period: string) {
        const allOrders = await this.orderModel.find().exec();
        const now = new Date();
      
        const filteredOrders = allOrders.filter(order => {
          const orderDate = new Date(order.date);
      
          if (period === 'diario') {
            return orderDate.toDateString() === now.toDateString();
          }
      
          if (period === 'semanal') {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);
            return orderDate >= sevenDaysAgo;
          }
      
          if (period === 'mensal') {
            return (
              orderDate.getMonth() === now.getMonth() &&
              orderDate.getFullYear() === now.getFullYear()
            );
          }
      
          return true; 
        });
      
        const quantidadeTotal = filteredOrders.length;
        const receitaTotal = filteredOrders.reduce((sum, o) => sum + o.total, 0);
        const valorMedio = quantidadeTotal > 0 ? receitaTotal / quantidadeTotal : 0;
      
        return {
          quantidadeTotal,
          receitaTotal,
          valorMedio: +valorMedio.toFixed(2),
        };
      }
}