import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/products.schema';
import { Category } from '../categories/schemas/categories.schema';

@Injectable()
export class ProductService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

    async getProducts(){
        return this.productModel.find().exec();
    }

    async getProductById(id: string) {
        return await this.productModel.findById(id).exec();
    }

    async getProductByName(name: string) {
        return await this.productModel.findOne({name}).exec();
    }

    async createProduct(productData: Partial<Product>) {
        return await new this.productModel(productData).save();
    }

    async deleteProduct(id:string) {
        return await this.productModel.deleteOne({ _id:id }).exec();
    }

    async updateProduct(id: string, updateProduct: Partial<Product>): Promise<Category | null>{
        return await this.productModel.findByIdAndUpdate(id, updateProduct, { new: true}).exec();
    }
}