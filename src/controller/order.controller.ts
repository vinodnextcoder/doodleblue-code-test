import { Body, Controller, Get, Param, Post, Query, Req, Res } from "@nestjs/common";
import { Order } from "../model/order.schema";
import { orderService } from "../service/order.service";
import { Handler } from "src/utils/handler";
import { validateAsync} from 'parameter-validator';


@Controller('/api/v1/order')
export class OrderController {
    constructor(
        private Handler: Handler,
        private orderService: orderService,
    ) { }

   
    /**
     * 
     * @param response 
     * @param order 
     * find element
     * add order
     * update product
     * success and error response send
     * make list
     */

    @Post('/addOrder')
    async addOrders(@Res() response,  @Req() request,@Body() order: Order) {
        try {
            /**
             * validate missing params
             */
            let param = await validateAsync(order, ['orderItem','shippinginfo']);
            let orderDetails = await this.Handler.addOrder(order,request)
            /**
             * checking if error occured
             */
            if (orderDetails && orderDetails.transaction_id === null) {
                return this.Handler.errorException(response, orderDetails);
            }
            let result = this.Handler.success(response, orderDetails);
            return result;
        }
        catch (error) {
            return this.Handler.errorException(response, error);
        }
    }

    

    @Post('/cancelOrder')
    async CancelOrders(@Res() response, @Body() order: Order) {
        try {
            let productCancel = await this.Handler.cancelProduct(order);
            /**
             * checking if somthing went wrong 
             * and send to error exception handler
             */
            if (productCancel && productCancel.status == 1999) {
                return this.Handler.errorException(response, productCancel);
            }
            let result = this.Handler.success(response, productCancel);
            return result;
        }
        catch (error) {
            return this.Handler.errorException(response, error);
        }

    }
    async findOrders(type,search) {
        try {
            const queryResult = await this.orderService.readOrdersCusto(type,search);  
            return queryResult;
        }
        catch (error) {
            return {
                status: 1999,
                message: 'Failed to read order'
            }
        }
    }
    /**
     * 
     * @param response 
     * @param type 
     * @param search 
     * @returns list of order and customer
     */
    @Get('/product/:type')
    async getProduct(@Res() response,@Param('type') type:string,@Query('search') search: string) {
        try {
            let queryResultData = await this.findOrders(type,search)
            if (queryResultData && queryResultData.status == 1999) {
                return this.Handler.errorException(response, queryResultData);
            }
            let result = this.Handler.success(response, queryResultData);
            return result;
        }
        catch (error) {
            return this.Handler.errorException(response, error);
        }

    }
}