
import { Controller, Get, Post, Delete, Put, Param, Body, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from 'src/orders/schemas/orders.schema';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    async getOrder() {
        return await this.orderService.getOrders();
    }

    @Get(':id')
    async getOrderById(@Param('id') id:string) {
        return await this.orderService.getOrderById(id);
    }

    @Post()
    async createOrder(@Body() orderData: Partial<Order>) {
        return await this.orderService.createOrder(orderData);
    }
    
    @Delete(':id')
    async deleteOrder(@Param('id') id:string) {
        return await this.orderService.deleteOrder(id);
    }

    @Put(':id')
    async updateOrder( @Param('id') id: string, @Body() orderData: Partial <Order>) {
        return await this.orderService.updateOrder(id, orderData);
    }

    @Get('dashboard')
  async getDashboard(@Query('period') period?: string) {
    return this.orderService.getDashboardData(period || '');
  }




}