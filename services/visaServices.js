const status = require("../enums/status");
const visaModel=require("../model/visaModel/visaModel")


const visaServices = {


    createWeeklyVisa: async (insertObj) => {
        return await visaModel.create(insertObj);
    },

    findWeeklyVisa: async (query) => {
        return await visaModel.findOne(query);
    },

    deleteWeeklyVisa: async (query) => {
        return await visaModel.deleteOne(query);
    },

    weeklyVisaList:async(query)=>{
        return await visaModel.find(query);
    },
    updateWeeklyVisa: async (query, updateObj) => {
        return await visaModel.findOneAndUpdate(query, updateObj, { new: true });
    },
    weeklyVisaListPaginate: async (validatedBody) => {
        let query = { status:status.ACTIVE};
        const { page, limit} = validatedBody;
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: { createdAt: -1 ,},
        };
        return await visaModel.paginate(query, options);
    },
}

module.exports = { visaServices };