import mongoose, { Schema, Document, PopulatedDoc, Types, PopulateOption } from "mongoose";
import Task, { ITask } from "./Task";
import { IUser } from "./User";
import Note from "./Note";

//TypeScript
export interface IProject extends Document {
    projectName: string;
    clientName: string;
    description: string;
    tasks: PopulatedDoc<ITask & Document>[];
    manager: PopulatedDoc<IUser & Document>;
    team: PopulatedDoc<IUser & Document>[];
    estimatedCompletionDate: Date; // Agregar el nuevo campo
}

//Mongoose
const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ],
    manager: {
        type: Types.ObjectId,
        ref: 'User'
    },
    team: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
    estimatedCompletionDate: {
        type: Date, // Tipo Date para almacenar fechas
        required: true // Puedes ajustar esto según tus requisitos
    }
}, { timestamps: true });

//Middleware
ProjectSchema.pre('deleteOne', {document: true}, async function () {
    const projectId = this._id
    if(!projectId) return 
    const tasks = await Task.find({project: projectId})
    for(const task of tasks){
        await Note.deleteMany({task: task.id})
    }
    await Task.deleteMany({project: projectId})
})

const Project = mongoose.model<IProject>('Project', ProjectSchema)

export default Project