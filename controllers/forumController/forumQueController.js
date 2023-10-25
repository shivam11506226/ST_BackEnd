const status = require("../../enums/status");
const schemas = require('../../utilities/schema.utilities');

//************************************SERVICES**********************************************************/

const { forumQueServices } = require('../../services/forumQueServices');
const { createforumQue, findforumQue, findforumQueData, deleteforumQue, updateforumQue, forumQueListLookUp } = forumQueServices;
const { userServices } = require('../../services/userServices');
const { createUser, findUser, getUser, findUserData, updateUser } = userServices;
const { forumQueAnsCommServices } = require('../../services/forumQueAnsComm');
const { createforumQueAnsComm, findforumQueAnsComm, findforumQueAnsCommData, updateforumQueAnsComm, deleteforumQueAnsComm, forumListLookUp } = forumQueAnsCommServices
const {
    actionCompleteResponse,
    sendActionFailedResponse,
} = require("../../common/common");
const { bookmarkServices } = require('../../services/bookmarkServices');
const { createbookmark, findbookmark, deletebookmark, bookmarkList, updatebookmark, bookmarkListPaginate } = bookmarkServices;

exports.createPost = async (req, res, next) => {
    try {
        const { userId, content } = req.body;
        const isUser = await findUser({ _id: userId });
        if (!isUser) {
            return sendActionFailedResponse(res, {}, 'User not found')
        }
        const obj = {
            userId: isUser._id,
            content: content
        }
        const result = await createforumQue(obj);
        return actionCompleteResponse(res, result, 'You are posted query successfully.');
    } catch (error) {
        console.log("error========>>>>>>", error);
        // sendActionFailedResponse(res, {}, error.message);
        return next(error);
    }
}

exports.getPost = async (req, res, next) => {
    try {
        const result = {}; // Declare as an object
        const { search, page, limit, questionId, userId } = req.query;
        const unanswered = await forumQueListLookUp(req.query);
        if (unanswered) {
            result.unanswered = unanswered;
        }

        const answered = await forumListLookUp(req.query);
        if (answered) {
            result.answered = answered;
        }

        if (result.unanswered || result.answered) {
            return actionCompleteResponse(res, result, 'All posts successfully.');
        } else {
            return sendActionFailedResponse(res, [], 'No posts found.');
        }
    } catch (error) {
        console.log("error========>>>>>>", error);
        return next(error);
    }
}


exports.updatePost = async (req, res, next) => {
    try {
        const { content } = req.body;
        const isUser = await findUser({ _id: req.userId });
        if (!isUser) {
            return sendActionFailedResponse(res, {}, 'User not found')
        }
        const result = await updateforumQue({ userID: isUser._id }, { content: content });
        return actionCompleteResponse(res, result, 'Post edited successfully.');
    } catch (error) {
        console.log("error========>>>>>>", error);
        // sendActionFailedResponse(res,{},error.message);
        return next(error);
    }
}


exports.deletePost = async (req, res, next) => {
    try {
        const isUser = await findUser({ _id: req.userId });
        if (!isUser) {
            return sendActionFailedResponse(res, {}, 'User not found')
        }
        const result = await updateforumQue({ userID: isUser._id }, { status: status.DELETE });
        return actionCompleteResponse(res, result, 'Post deleted successfully.');
    } catch (error) {
        console.log("error========>>>>>>", error);
        // sendActionFailedResponse(res,{},error.message);
        return next(error);
    }
}


exports.getPostOfUser = async (req, res, next) => {
    try {
        const { search, page, limit, questionId, userId } = req.query;
        const isUser = await findUser({ _id: userId });
        if (!isUser) {
            return sendActionFailedResponse(res, {}, 'User not found')
        }
        const unanswered = await forumQueListLookUp(req.query);
        const answered = await forumListLookUp(req.query);
        const result = {
            unanswered,
            answered,
        };
        if (!unanswered) {
            return actionCompleteResponse(res, result, 'All posts successfully.');
        } else if (!answered) {
            return sendActionFailedResponse(res, [], 'No posts found.');
        }
    } catch (error) {
        console.log("error========>>>>>>", error);
        return next(error);
    }
}









//add question in bookmark
exports.addBookmark = async (req, res, next) => {
    try {
        const { questionId, userId } = req.body;
        const isUser = await findUser({ _id: userId });
        if (!isUser) {
            return sendActionFailedResponse(res, {}, 'User not found')
        }
        const isQuestionExist = await findforumQue({ _id: questionId });
        if (!isQuestionExist) {
            return sendActionFailedResponse(res, {}, 'Post not found')
        }
        const isAlreadyBookmarked = await findbookmark({ userId: userId, status: status.ACTIVE });
        if (!isAlreadyBookmarked) {
            const obj = {
                questionId: questionId,
                userId: userId
            }
            const result = await createbookmark(obj);
            return actionCompleteResponse(res, result, 'Post added in your bookmark successfully.');
        }
        if (isAlreadyBookmarked.questionId.includes(questionId)) {
            const updateResult = await updatebookmark(
                { userId: isUser._id, status: status.ACTIVE },
                { $pull: { questionId: questionId } }
            );
            return actionCompleteResponse(
                res,
                updateResult,
                "You have removed  post from your bookmark"
            );
        } else {
            const updateResult = await updatebookmark(
                { userId: isUser._id, status: status.ACTIVE },
                { $push: { questionId: questionId } }
            );
            return actionCompleteResponse(res, updateResult, "You have liked the comment");
        }

    } catch (error) {
        console.log("error========>>>>>>", error);
        return next(error);
    }
}