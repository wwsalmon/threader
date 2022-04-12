import mongoose, {Model} from "mongoose";

export interface UserObj {
    email: string,
    username: string,
    name: string,
    image: string,
}

export interface ThreadObj {
    name: string,
    urlName: string,
    userId: string,
}

export interface NoteObj {
    body: string,
    threadId: string,
    userId: string,
}

// generic / type alias from https://stackoverflow.com/questions/26652179/extending-interface-with-generic-in-typescript
export type DatedObj<T extends {}> = T & {
    _id: string,
    createdAt: string, // ISO date
    updatedAt: string, // ISO date
}

export type IdObj<T extends {}> = T & {
    _id: string,
}

const UserSchema = new mongoose.Schema({
    email: { required: true, type: String },
    name: { required: true, type: String },
    image: { required: true, type: String },
    username: { required: true, type: String },
}, {
    timestamps: true,
});

const ThreadSchema = new mongoose.Schema({
    name: { required: true, type: String },
    urlName: { required: true, type: String },
    userId: { required: true, type: mongoose.Types.ObjectId },
}, {
    timestamps: true,
});

const NoteSchema = new mongoose.Schema({
    body: { required: false, type: String },
    userId: { required: true, type: mongoose.Types.ObjectId },
    threadId: { required: true, type: mongoose.Types.ObjectId },
}, {
    timestamps: true,
});

export const UserModel = (!!mongoose.models && mongoose.models.user as Model<UserObj>) || mongoose.model<UserObj>("user", UserSchema);
export const ThreadModel = (!!mongoose.models && mongoose.models.thread as Model<ThreadObj>) || mongoose.model<ThreadObj>("thread", ThreadSchema);
export const NoteModel = (!!mongoose.models && mongoose.models.note as Model<NoteObj>) || mongoose.model<NoteObj>("note", NoteSchema);