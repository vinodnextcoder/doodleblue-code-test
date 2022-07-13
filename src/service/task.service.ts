import {
    Injectable
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Task, TaskDocument } from "../model/task.schema";

@Injectable()
export class taskService {
    constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) { }
    /**
     * insert and update record
     * @param task 
     * @returns 
     */
    async createTask(task: Object): Promise<Task> {
        const newTask = new this.taskModel(task);
        let name = newTask.title
        let updateRecord = await this.taskModel.findOneAndUpdate(
            { title: name },
            { $set: task },
            { upsert: true, new: true }
        );
        return updateRecord;
    }
    async readProduct(req): Promise<any> {

        if (req && req.id) {
            return this.taskModel.findOne({ _id: req.id }).populate("createdBy").exec();
        }
        if (req && req.title) {
            return this.taskModel.findOne(req).populate("createdBy").exec();
        }
        return this.taskModel.findOne(req).populate("createdBy").exec();
    }
    async update(id, product): Promise<any> {
        return await this.taskModel.findByIdAndUpdate(id, product);
    }

}