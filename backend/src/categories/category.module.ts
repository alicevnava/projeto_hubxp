import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category, CategorySchema } from './schemas/categories.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema, collection: 'category' }]),],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports: [CategoryService], 
})

export class CategoryModule {}