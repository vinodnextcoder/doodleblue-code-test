import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "./user.schema";
import { Task } from "./task.schema";
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

/**
 * this schema for upload product task
 */

@Schema({ _id: false })
class shippingInfo extends Document {
    @Prop()
    address: string
    @Prop()
    city: string
    @Prop()
    phoneNo: string
    @Prop()
    postalCode: string
    @Prop()
    country: string
}
export const shippingInfochema = SchemaFactory.createForClass(shippingInfo);

@Schema({ _id: false })
class orderItems extends Document {
    @Prop()
    name: string
    @Prop()
    title: string
    @Prop()
    quantity: string
    @Prop()
    price: string
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Task" })
    product: Task
}
export const orderItemsSchema = SchemaFactory.createForClass(orderItems);

@Schema()
export class Order {

    @Prop({ type: [orderItemsSchema] })
    orderItem: Array<orderItems>;

    @Prop({ type: shippingInfochema })
    shippinginfo: shippingInfo;

    @Prop()
    paidAt: Date
    @Prop()
    itemsPrice: number
    @Prop()
    taxPrice: number
    @Prop()
    shippingPrice: number
    @Prop()
    totalPrice: number
    @Prop()
    orderStatus: string
    @Prop()
    deliveredAt: Date

    @Prop({ default: Date.now() })
    uploadDate: Date
    
    @Prop()
    transaction_id:string


    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    createdBy: User
}

export const OrderSchema = SchemaFactory.createForClass(Order);





