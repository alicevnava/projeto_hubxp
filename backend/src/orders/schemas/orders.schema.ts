
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';


export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
    @Prop()
    date: Date;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
    productIds: Types.ObjectId[];

    @Prop()
    total: number;

}

export const OrderSchema = SchemaFactory.createForClass(Order);
