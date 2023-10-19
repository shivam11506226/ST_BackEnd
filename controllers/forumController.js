const status = require("../enums/status");
const schemas = require('../utilities/schema.utilities');
const Joi=require('joi')
//********************************SERVICES***************************************************/
const { forumServices } = require('../services/forumServices');
const { createforum, findforum, findforumData, deleteforumStatic, updateforumStatic } = forumServices;
const {
    actionCompleteResponse,
    sendActionFailedResponse,
} = require("../common/common");
// const status = require("../enums/status");
const staticContentType = require('../enums/staticContentType')
exports.startForumDiscusiion = async (req, res, next) => {
    try {
     const {}=req.body;
        const user = await findUser({ _id: req.userId });
        if(!user){
            sendActionFailedResponse(res,{},' user not found')
        }
        const existingData = await findstaticContent({ type: type });
        console.log("existingData==========", existingData);
        if (existingData) {
            const updatedData = await updatestaticContentStatic({ _id: existingData._id }, req.body);
            actionCompleteResponse(res, updatedData, 'Static content updated successfully.');
        } else {
            const result = await createstaticContent(req.body);
            actionCompleteResponse(res, result, 'Static content created successfully.');
        }
    } catch (error) {
        console.log("error========>>>>>>", error);
        // sendActionFailedResponse(res, {}, error.message);
        return next(error);
    }
}

exports.listStaticContent = async (req, res, next) => {
    try {
        const { type, subType } = req.query;
        if (type & subType) {
            const result = await findstaticContentData({ type: type, subType: subType, status: status.ACTIVE });
            actionCompleteResponse(res, result, 'Static content listed successfully.')
        } else if (type) {
            const result = await findstaticContentData({ type: type, status: status.ACTIVE });
            actionCompleteResponse(res, result, 'Static content listed successfully.')
        }
        else {
            const result = await findstaticContentData({ status: status.ACTIVE });
            actionCompleteResponse(res, result, 'Static content listed successfully.')
        }
    } catch (error) {
        console.log("error========>>>>>>", error);
        return next(error);
    }
}

exports.updateStaticContent = async (req, res, next) => {
    const staticContentId = req.body.staticContentId;
    try {
 // const isAdmin = await findUser({ _id: req.userId });
        // if(!isAdmin){
        //     sendActionFailedResponse(res,{},'Unauthorised user')
        // }
        const result = await updatestaticContentStatic({ _id: isDataExist._id }, req.body);
        actionCompleteResponse(res, result, 'Static content updated successfully.');
    } catch (error) {
        console.log("error========>>>>>>", error);
        // sendActionFailedResponse(res,{},error.message);
        return next(error);
    }
}


exports.deleteStaticContent = async (req, res, next) => {
    const staticContentId = req.body.staticContentId;
    try {
 // const isAdmin = await findUser({ _id: req.userId });
        // if(!isAdmin){
        //     sendActionFailedResponse(res,{},'Unauthorised user')
        // }
        const result = await updatestaticContentStatic({ _id: isDataExist._id }, { status: status.DELETE });
        actionCompleteResponse(res, result, 'Static content deleted successfully.')
    } catch (error) {
        console.log("error========>>>>>>", error);
        // sendActionFailedResponse(res,{},error.message);
        return next(error);
    }
}
