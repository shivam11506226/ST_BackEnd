let cloudinary = require("cloudinary");
cloudinary.config({
    cloud_name: "dultedeh8",
    api_key: "461991833927796",
    api_secret: "ruuF-4CFhQVh205cif_tQqNBBcA",
});
const status = require("../enums/status");
const schemas = require('../utilities/schema.utilities');
//********************************SERVICES***************************************************/
const { staticContentServices } = require('../services/staticContentServices');
const { createstaticContent, findstaticContent, findstaticContentData, deletestaticContentStatic, updatestaticContentStatic } = staticContentServices;
const {
    actionCompleteResponse,
    sendActionFailedResponse,
} = require("../common/common");
// const status = require("../enums/status");
const staticContentType = require('../enums/staticContentType')
exports.createStaticContent = async (req, res, next) => {
    try {
        const { title, description, type, subType } = req.body;
        // const isAdmin = await findUser({ _id: req.userId });
        // if(!isAdmin){
        //     sendActionFailedResponse(res,{},'Unauthorised user')
        // }
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
        const isDataExist = await findstaticContent({_id:staticContentId,status:status.ACTIVE});
        if(!isDataExist){
            actionCompleteResponse(res, result, 'Static content not exist.')
        }
        const result = await updatestaticContentStatic({ _id: isDataExist._id }, { status: status.DELETE });
        actionCompleteResponse(res, result, 'Static content deleted successfully.')
    } catch (error) {
        console.log("error========>>>>>>", error);
        // sendActionFailedResponse(res,{},error.message);
        return next(error);
    }
}
