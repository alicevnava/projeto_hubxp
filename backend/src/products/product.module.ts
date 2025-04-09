import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product, ProductSchema } from './schemas/products.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema, collection: 'product' }]),],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService], 
})

export class ProductModule {}