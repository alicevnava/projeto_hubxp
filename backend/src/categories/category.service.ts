import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/categories.schema';

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

    async getCategories() {
        return this.categoryModel.find().exec();
    }

    async getCategoryById(id: string) {
        return await this.categoryModel.findById(id).exec();
    }

    async getCategoryByName(name: string) {
        return await this.categoryModel.findOne({name}).exec();
    }

    async createCategory(categoryData: Partial<Category>) {
        return await new this.categoryModel(categoryData).save();
    }

    async deleteCategory(id: string) {
        return await this.categoryModel.deleteOne({ _id: id }).exec();
    }

    async updateCategory(id: string, updatedCategory: Partial<Category>): Promise<Category | null> {
        return await this.categoryModel.findByIdAndUpdate(id, updatedCategory, { new: true }).exec();
    }
}

