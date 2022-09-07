import {NextApiHandler} from "next";
import nextApiEndpoint from "../../utils/nextApiEndpoint";
import {res200, res400, res500, res403} from "next-response-helpers";
import {NoteModel, ThreadModel} from "../../models/models";

const handler: NextApiHandler = nextApiEndpoint({
    getFunction: async (req, res, session, thisUser) => {
        const {page, threadId} = req.query;

        if (!threadId) return res400(res);

        const notes = await NoteModel.find({threadId: threadId.toString()}).sort({createdAt: -1});

        return res200(res, {notes});
    },
    postFunction: async (req, res, session, thisUser) => {
        const {threadId, noteId, body} = req.body;

        if (!threadId && !noteId) return res400(res);

        if (noteId) {
            const thisNote = await NoteModel.findById(noteId.toString());

            if (!thisNote) return res500(res, new Error("note with this ID not found"));

            if (thisNote.userId.toString() !== thisUser._id.toString()) return res403(res);

            await thisNote.update({body: body || ""});

            return res200(res);
        } else {
            await NoteModel.create({body: body || "", threadId: threadId, userId: thisUser._id});
        }

        return res200(res);
    },
    deleteFunction: async (req, res, session, thisUser) => {
        const {id} = req.body;

        const thisNote = await NoteModel.findOne({_id: id, userId: thisUser._id});

        if (!thisNote) return res500(res, new Error("No note with this ID exists"));

        await NoteModel.deleteOne({_id: id});

        return res200(res);
    },
});

export default handler;