const advertisementModel = require('../../model/btocModel/advertisementModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const advertisementServices={
    createadvertisement: async (insertObj) => {
        return await advertisementModel.create(insertObj);
    },

    findadvertisementData: async (query) => {
        return await advertisementModel.findOne(query)
    },

    deleteadvertisement: async (query) => {
        return await advertisementModel.deleteOne(query);
    },

    advertisementList: async (query) => {
        return await advertisementModel.find(query)
    },
    updateadvertisement: async (query, updateObj) => {
        return await advertisementModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotaladvertisement: async (body) => {
        return await advertisementModel.countDocuments(body)
    },
    getAdvertisment:async(query)=>{
        const {page,limit}=query;
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await advertisementModel.paginate(query, options);
    }
}
module.exports ={advertisementServices}