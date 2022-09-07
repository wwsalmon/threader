import {NextApiHandler} from "next";
import nextApiEndpoint from "../../utils/nextApiEndpoint";
import {res200, res400, res500} from "next-response-helpers";
import {ThreadModel} from "../../models/models";

const handler: NextApiHandler = nextApiEndpoint({
    getFunction: async (req, res, session, thisUser) => {
        const {page} = req.query;

        const threads = await ThreadModel.find({userId: thisUser._id});

        return res200(res, {threads});
    },
    postFunction: async (req, res, session, thisUser) => {
        const {name, urlName} = req.body;

        if (!name || !urlName) return res400(res, "Missing parameters");

        const existingThread = await ThreadModel.findOne({urlName: urlName, userId: thisUser._id});

        console.log(existingThread);

        if (existingThread) return res500(res, new Error("Thread with this urlName already exists"));

        await ThreadModel.create({name, urlName, userId: thisUser._id});

        return res200(res);
    },
    deleteFunction: async (req, res, session, thisUser) => {
        const {id} = req.query;

        const thisThread = await ThreadModel.findOne({_id: id, userId: thisUser._id});

        if (!thisThread) return res500(res, new Error("No thread with this ID exists"));

        await ThreadModel.deleteOne({_id: id});

        return res200(res);
    },
});

export default handler;