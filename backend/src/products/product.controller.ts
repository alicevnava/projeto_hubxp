import { Controller, Get, Post, Delete, Put, Param, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './schemas/products.schema';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}


    @Get()
    async getProduct(){
        return await this.productService.getProducts();
    }

    @Get(':id')
    async getProductById(@Param('id') id:string){
        return await this.productService.getProductById(id);
    }

    @Get('name/:name')
    async getProductByName(@Param('name') name:string) {
        return await this.productService.getProductByName(name);
    }

    @Post()
    async createProduct(@Body() productData: Partial<Product>){
        return await this.productService.createProduct(productData);
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id:string){
        return await this.productService.deleteProduct(id);
    }

    @Put(':id')
    async updateProduct ( @Param('id') id: string, @Body() productData: Partial<Product>) {
        return await this.productService.updateProduct(id, productData);
    }

} 