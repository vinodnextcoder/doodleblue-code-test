import {
    Injectable,
    NotFoundException,
    ServiceUnavailableException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order, OrderDocument } from "../model/order.schema";
import { User, UserDocument } from "../model/user.schema";

@Injectable()
export class orderService {

    constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>,
                @InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async createOrder(order: Object): Promise<Order> {
        const newOrder = new this.orderModel(order);
        let responseData = await newOrder.save();
        return responseData
    }

    async readOrders(id): Promise<any> {
        if (id.id) {
            return this.orderModel.findOne({ _id: id.id }).populate("createdBy").exec();
        }
        return this.orderModel.findOne(id).populate("createdBy").exec();
    }
    
    async readOrdersCusto(type, search): Promise<any> {
        let pipeline: any[] = []
        if (type == 'date') {
            pipeline = [
                {
                    '$group': {
                        '_id': {
                            '$dateToString': {
                                'format': '%Y-%m-%d',
                                'date': '$uploadDate'
                            }
                        },
                        'product_count': {
                            '$sum': 1
                        }
                    }
                }, {
                    '$project': {
                        '_id': false,
                        'date': '$_id',
                        'product_count': 1
                    }
                }
            ]
            return this.orderModel.aggregate(pipeline)
        } else if (type == 'product') {
            pipeline = [
                {
                    '$group': {
                        '_id': '$orderItem',
                        'number_of_products': {
                            '$sum': 1
                        },
                        'customer': {
                            '$push': {
                                'createdBy': '$createdBy'
                            }
                        }
                    }
                }, {
                    '$lookup': {
                        'from': 'users',
                        'localField': 'customer.createdBy',
                        'foreignField': '_id',
                        'as': 'customerList'
                    }
                }, {
                    '$project': {
                        '_id':false,
                        'number_of_products': 1,
                        'customerList.fullname': 1,
                        'customerList.email': 1
                    }
                }
            ]
            return this.orderModel.aggregate(pipeline)
        }
        else {

            pipeline = [{
                '$lookup': {
                    'from': 'orders',
                    'localField': '_id',
                    'foreignField': 'createdBy',
                    'as': 'orders_info'
                }
            }, {
                '$project': {
                    'fullname': 1,
                    'email': 1,
                    'orders_info': 1
                }
            },
            { '$sort': { 'createdDate': 1 } }
            ];
            if (search) {
                pipeline.unshift({ '$match': { 'fullname': { '$regex': search, '$options': 'i' } } })
            }

        }
        return this.userModel.aggregate(pipeline)
    }

    async update(id, order): Promise<Order> {
        return await this.orderModel.findByIdAndUpdate(id, order)
    }

}