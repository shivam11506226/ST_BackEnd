const issuedType = require("../enums/issuedType");
const status = require("../enums/status");
const visaModel=require("../model/visaModel/visaModel");
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//


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
        let query = { status:status.ACTIVE,issuedType:issuedType.WEEKLY_VISA};
        const { page, limit} = validatedBody;
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: { createdAt: -1 ,},
        };
        const result= await visaModel.paginate(query, options);
        return result;
    },

    getNoVisaByPaginate:async(query)=>{
        let {page,limit}=query;
        let data={status:status.ACTIVE,issuedType:issuedType.NO_VISA};
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: { createdAt: -1 ,},
        };
        return await visaModel.paginate(data, options);
    },
    montholyVisaListPaginate: async (validatedBody) => {
        let query = { status:status.ACTIVE,issuedType:issuedType.MONTHLY_VISA};
        const { page, limit,search} = validatedBody;
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: { createdAt: -1 },
        };
        return await visaModel.paginate(query, options);
    },
    onarrivalVisaListPaginate: async (validatedBody) => {
        let query = { status:status.ACTIVE,issuedType:issuedType.VISA_ON_ARRIVAL};
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