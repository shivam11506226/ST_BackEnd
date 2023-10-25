const status = require("../../enums/status");
const schemas = require("../../utilities/schema.utilities");
const commentStatus = require("../../enums/commentStatus");
//************************************SERVICES**********************************************************/

const { forumQueServices } = require("../../services/forumQueServices");
const {
    createforumQue,
    findforumQue,
    findforumQueData,
    deleteforumQue,
    updateforumQue,
    forumQueListLookUp,
} = forumQueServices;
const { userServices } = require("../../services/userServices");
const { createUser, findUser, getUser, findUserData, updateUser } = userServices;
const { forumQueAnsCommServices } = require("../../services/forumQueAnsComm");
const {
    createforumQueAnsComm,
    findforumQueAnsComm,
    findforumQueAnsCommData,
    updateforumQueAnsComm,
    deleteforumQueAnsComm,forumListLookUp,
} = forumQueAnsCommServices;
const {
    actionCompleteResponse,
    sendActionFailedResponse,
} = require("../../common/common");
const { likesServices } = require("../../services/likesSchema");
const { createlikes, findlikes, findlikesData, deletelikes, updatelikes } =
    likesServices;
const { subCommentServices } = require("../../services/subCommentServices");
const {
    createsubComment, findsubComment, findsubCommentData, deletesubComment, updatesubComment, } = subCommentServices;
exports.createComment = async (req, res, next) => {
    try {
        const { userId, questionId, content, commentId } = req.body;
        const isUser = await findUser({ _id: userId });
        if (!isUser) {
            return sendActionFailedResponse(res, {}, "User not found");
        }
        const isQuestionExist = await findforumQue({ _id: questionId });
        if (!isQuestionExist) {
            return sendActionFailedResponse(res, {}, "Post not found");
        }
        if (commentId) {
            const parentComment = await findforumQueAnsComm({
                _id: commentId,
                status: status.ACTIVE,
            });
            if (!parentComment) {
                return sendActionFailedResponse(res, {}, "Comment not found");
            }
            const subComment = {
                userId: userId,
                commentId: commentId,
                content: content,
                commentStatus: commentStatus.SUBCOMMENT,
            };
            const result = await createsubComment(subComment);
            return actionCompleteResponse(
                res,
                result,
                "You are commented successfully"
            );
        }
        const comment = {
            userId: userId,
            content: content,
            questionId: questionId,
            _id: data._id,

        };
        const data = await createforumQueAnsComm(comment);
        const result = {
            userId: data.userId,
            questionId: data.content
        }
        return actionCompleteResponse(
            res,
            result,
            "You are commented successfully"
        );
    } catch (error) {
        console.log("error========>>>>>>", error);
        return next(error);
    }
};

exports.getPostComment = async (req, res, next) => {
    try {
        const { search, page, limit, questionId, userId } = req.query;
        // const unanswered = await findforumQueAnsCommData(req.body);
        const result = await forumListLookUp(req.query);
        // const result = {
        //     unanswered,
        //     answered,
        // };
        actionCompleteResponse(res, result, "All posts successfully.");
    } catch (error) {
        console.log("error========>>>>>>", error);
        return next(error);
    }
};

exports.updatePostComment = async (req, res, next) => {
    try {
        const { content } = req.body;
        const isUser = await findUser({ _id: req.userId });
        if (!isUser) {
            sendActionFailedResponse(res, {}, "User not found");
        }
        const result = await updateforumQueAnsComm(
            { userId: isUser._id },
            { content:content }
        );
        actionCompleteResponse(res, result, "Post edited successfully.");
    } catch (error) {
        console.log("error========>>>>>>", error);
        return next(error);
    }
};

exports.deletePostComment = async (req, res, next) => {
    try {
        const isUser = await findUser({ _id: req.userId });
        if (!isUser) {
            sendActionFailedResponse(res, {}, "User not found");
        }
        const result = await deleteforumQueAnsComm({ userId: isUser._id });
        actionCompleteResponse(res, result, "Post deleted successfully.");
    } catch (error) {
        console.log("error========>>>>>>", error);
        return next(error);
    }
};

exports.getPostCommentsOfUser = async (req, res, next) => {
    try {
        const { search, page, limit, questionId, userId } = req.query;
        // const unanswered = await findforumQueAnsCommData(req.body);
        const isUser = await findUser({ _id: userId });
        console.log("isUser============", isUser);
        if (!isUser) {
            return sendActionFailedResponse(res, {}, "User not found");
        }
        const result = await findforumQueAnsCommData(req.query);
        // const result = {
        //     unanswered,
        //     answered,
        // };
        return actionCompleteResponse(res, result, "All posts successfully.");
    } catch (error) {
        console.log("error========>>>>>>", error);
        return next(error);
    }
};


//like comments which user give on post*********************************************
exports.likeComments = async (req, res, next) => {
    try {
        const { userId, commentId } = req.body;
        const isUser = await findUser({ _id: userId });
        if (!isUser) {
            return sendActionFailedResponse(res, {}, "User not found");
        }
        const isCommentExist = await findforumQueAnsComm({
            _id: commentId,
            status: status.ACTIVE,
        });
        if (!isCommentExist) {
            return sendActionFailedResponse(res, {}, "Comment not found");
        }
        const isAlreadyLiked = await findlikes({
            commentId: commentId,
            status: status.ACTIVE,
        });
        if (isAlreadyLiked.likes.includes(userId)) {
            const updateResult = await updatelikes(
                { commentId: isCommentExist._id, status: status.ACTIVE },
                { $pull: { likes: userId } }
            );
            updateResult._doc.ikeslength = updateResult.likes.length;
            return actionCompleteResponse(
                res,
                updateResult,
                "You have removed your like from the comment"
            );
        } else {
            const updateResult = await updatelikes(
                { commentId: commentId, status: status.ACTIVE },
                { $push: { likes: userId } }
            );
            updateResult._doc.likeslength = updateResult.likes.length;
            actionCompleteResponse(res, updateResult, "You have liked the comment");
        }
        const newLike = {
            commentId: commentId,
            likes: userId,
            status: "ACTIVE",
        };
        const savedLike = await createlikes(newLike);
        savedLike._doc.likeslength = savedLike.likes.length;
        return actionCompleteResponse(res, savedLike, "You have liked the comment");
    } catch (error) {
        console.log("error========>>>>>>", error);
        return next(error);
    }
};
//function for array operation--------------------------------
function findCommentById(comments, commentId) {
    for (const comment of comments) {
        if (comment._id === commentId) {
            return comment;
        }
        if (comment.comments) {
            const nestedComment = findCommentById(comment.comments, commentId);
            if (nestedComment) {
                return nestedComment;
            }
        }
    }
    return null;
}
