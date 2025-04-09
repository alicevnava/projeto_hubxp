import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { CategoryModule } from './categories/category.module';
import { ProductModule } from './products/product.module';
import { OrderModule } from './orders/order.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/hubxp'),
    CategoryModule,
    ProductModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
