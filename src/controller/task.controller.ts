import { Body, Controller, Delete, Get, HttpStatus, Param, Post, UseInterceptors, UploadedFiles, Put, Req, Res, Query, UploadedFile } from "@nestjs/common";
import { TaskDocument } from "../model/task.schema"
import { taskService } from "../service/task.service";
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { FileInterceptor } from "@nestjs/platform-express";
import { Handler } from "src/utils/handler";
import { validateAsync} from 'parameter-validator';


@Controller('/api/v1/task')
export class TaskController {
    constructor(private readonly taskService: taskService,private readonly Handler: Handler) { }
    @Post('/addProduct')
    @UseInterceptors(FileInterceptor('file'))
    async createBook(@Res() response, @Req() request, @Body() task: TaskDocument, @UploadedFile() file: Express.Multer.File) {
        try {
            /**
             * validate missing params
             */
            let param = await validateAsync(task, ['type']);
            let requestBody: any = {}
            if (file && task && task.type == "bulk") {
                const csvFilePath = resolve(`./public/${file.filename}`);
                const fileContent = readFileSync(csvFilePath, { encoding: 'utf-8' });
                const records = fileContent.split("\n");
                const res = await this.Handler.processRecords(records,request);
                const result = this.Handler.success(response, res);
                return result;
            }
            else {
                requestBody = { createdBy: request.user._id, ...task }
            }
            const newTask = await this.taskService.createTask(requestBody);
            const result = this.Handler.success(response, newTask);
            return result;
        }
        catch (error) {
            return this.Handler.errorException(response, error);
        }

    }

    @Get()
    async read(@Query() id): Promise<Object> {
        return await this.taskService.readProduct(id);
    }
}