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
}

module.exports = { visaServices };