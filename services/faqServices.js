const status = require("../enums/status");
const faqModel=require("../model/faqModel")


const faqServices={
    createfaq: async (insertObj) => {
        return await faqModel.create(insertObj);
    },

    findfaq: async (query) => {
        return await faqModel.findOne(query);
    },

    findfaqData: async (query) => {
        return await faqModel.find(query);
    },

    deletefaqStatic: async (query) => {
        return await faqModel.deleteOne(query);
    },

   
    updatefaqStatic: async (query, updateObj) => {
        return await faqModel.findOneAndUpdate(query, updateObj, { new: true });
    },
}

module.exports={faqServices}