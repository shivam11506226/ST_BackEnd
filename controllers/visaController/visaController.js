let cloudinary = require("cloudinary");
cloudinary.config({
    cloud_name: "dultedeh8",
    api_key: "461991833927796",
    api_secret: "ruuF-4CFhQVh205cif_tQqNBBcA",
});

const { visaServices } = require('../../services/visaServices');
const { createWeeklyVisa, findWeeklyVisa, deleteWeeklyVisa, weeklyVisaList, updateWeeklyVisa ,weeklyVisaListPaginate} = visaServices;
const { userServices } = require('../../services/userServices');
const { createUser, findUser, getUser, findUserData, updateUser } = userServices;
const {
    actionCompleteResponse,
    sendActionFailedResponse,
} = require("../../common/common");
const status = require("../../enums/status");

exports.createWeeklyVisa = async (req, res, next) => {
    try {
        const { countryName, price, validityPeriod, lengthOfStay, gallery, visaType } = req.body;
        // const isAdmin = await findUser({_id:req.userId});
        // if(!isAdmin){
        //     sendActionFailedResponse(res,{},'Unauthorised user')
        // }
        if (gallery) {
            var galleryData = [];
            for (var i = 0; i < gallery.length; i++) {
                const imageData = gallery[i];
                var data = await cloudinary.v2.uploader.upload(imageData, { resource_type: "auto" })
                const imageUrl = data.secure_url;
                galleryData.push(imageUrl)
                req.body.gallery = galleryData;
                const result = await createWeeklyVisa(req.body);
                actionCompleteResponse(res, result, 'weeklyVisa created successfully.')

            }
        } else {
            const result = await createWeeklyVisa(req.body);
            actionCompleteResponse(res, result, 'weeklyVisa created successfully.')

        }
    } catch (error) {
        console.log("error========>>>>>>", error);
        // sendActionFailedResponse(res,{},error.message);
        return next(error);
    }
}

exports.getWeeklyVisa = async (req, res, next) => {
    try {
        const {page,limit} = req.query;
       const options={page,limit}
        const result = await weeklyVisaListPaginate({},options);
         const currentDate= new Date();
         currentDate.setDate(currentDate.getDate() + 2)
         result.docs.forEach(doc => {
            doc.getData = `Submit Today For Guaranteed Visa By: ${currentDate}`;
          });
         console.log("result===========",result);
        actionCompleteResponse(res, result, 'weeklyVisa get data successfully.')
    } catch (error) {
        console.log("error========>>>>>>", error);
        // sendActionFailedResponse(res,{},error.message);
        return next(error);
    }
}

exports.updateWeeklyVisa = async (req, res, next) => {
    const weeklyVisaDataId=req.body.weeklyVisaDataId;
    try {
        if(!weeklyVisaDataId){
        console.log("====================");
            sendActionFailedResponse(res,{},'weeklyVisaDataId is required')
        }
        const { countryName, price, validityPeriod, lengthOfStay, visaType } = req.body;
        // const isAdmin = await findUser({_id:req.userId});
        // if(!isAdmin){
        //     sendActionFailedResponse(res,{},'Unauthorised user')
        // }
        const isDataExist=await findWeeklyVisa({_id:weeklyVisaDataId,status:status.ACTIVE});
        if(!isDataExist){
            sendActionFailedResponse(res,{},'Data not found')
        }
        const result = await updateWeeklyVisa({_id:isDataExist._id},req.body);
        actionCompleteResponse(res, result, 'weeklyVisa updated successfully.')
    } catch (error) {
        console.log("error========>>>>>>", error);
        // sendActionFailedResponse(res,{},error.message);
        return next(error);
    }
}


exports.deleteWeeklyVisa = async (req, res, next) => {
    const weeklyVisaDataId=req.body.weeklyVisaDataId;
    try {
        if(!weeklyVisaDataId){
        console.log("====================");
            sendActionFailedResponse(res,{},'weeklyVisaDataId is required')
        }
        // const isAdmin = await findUser({_id:req.userId});
        // if(!isAdmin){
        //     sendActionFailedResponse(res,{},'Unauthorised user')
        // }
        const isDataExist=await findWeeklyVisa({_id:weeklyVisaDataId,status:status.ACTIVE});
        if(!isDataExist){
            sendActionFailedResponse(res,{},'Data not found')
        }
        const result = await updateWeeklyVisa({_id:isDataExist._id},{status:status.DELETE});
        actionCompleteResponse(res, result, 'weeklyVisa updated successfully.')
    } catch (error) {
        console.log("error========>>>>>>", error);
        // sendActionFailedResponse(res,{},error.message);
        return next(error);
    }
}
