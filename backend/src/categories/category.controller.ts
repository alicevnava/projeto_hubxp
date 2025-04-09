
import { Controller, Get, Post, Delete, Put, Param, Body } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from 'src/categories/schemas/categories.schema';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    async getCategory() {
        return await this.categoryService.getCategories();
    }

    @Get(':id')
    async getCategoryById(@Param('id') id:string) {
        return await this.categoryService.getCategoryById(id);
    }

    @Get('name/:name')
    async getCategoryByName(@Param('name') name:string) {
        return await this.categoryService.getCategoryByName(name);
    }


    @Post()
    async createCategory(@Body() categoryData: Partial<Category>) {
        return await this.categoryService.createCategory(categoryData);
    }

    @Delete(':id')
    async deleteCategory(@Param('id') id:string) {
        return await this.categoryService.deleteCategory(id);
    }

    @Put(':id')
    async updateCategory( @Param('id') id: string, @Body() categoryData: Partial<Category>) {
        return await this.categoryService.updateCategory(id, categoryData);
    }
}
