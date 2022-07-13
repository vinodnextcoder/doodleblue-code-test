import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "./user.schema";

export type TaskDocument = Task & Document;

/**
 * this schema for upload product task
 */

@Schema()
export class Task {
 
    @Prop()
    title: string;
     
    @Prop()
    description: string;

    @Prop()
    productId: string;

    @Prop()
    type: string;

    @Prop()
    quantity: number;

    @Prop()
    price: number;

    @Prop()
    coverImage: string;

    @Prop()
    originalname: string;

    @Prop()
    encoding: string;
     
    @Prop()
    mimetype: string;

    @Prop()
    destination: string;
    @Prop()
    filename: string;

    @Prop()
    path: string;

    @Prop()
    size: string;

    @Prop({ default: Date.now() })
    uploadDate: Date

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    createdBy: User
}

export const TaskSchema = SchemaFactory.createForClass(Task);
