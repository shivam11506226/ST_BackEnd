const brbuserModel = require('../model/brbuser.model');
const userType = require("../enums/userType");
const status = require("../enums/status");
const brbuserServices = {
    createbrbuser: async (insertObj) => {
        return await brbuserModel.create(insertObj);
    },

    findbrbuser: async (query) => {
        return await brbuserModel.findOne(query).select('-otp -isApproved -roles ');
    },

    getbrbuser: async (query) => {
        return await brbuserModel.findOne(query).select('-otp -location -isOnline -coinBalance -isChange -otpExpireTime -firstTime');
    },

    findbrbuserData: async (query) => {
        return await brbuserModel.findOne(query).select('-createdAt -updatedAt -roles -password -isOnline -firstTime -isApproved');
    },

    deletebrbuser: async (query) => {
        return await brbuserModel.deleteOne(query);
    },

    brbuserList: async (query) => {
        return await brbuserModel.find(query).select('-otp -location -isOnline -coinBalance -isChange -otpExpireTime -firstTime -approveStatus -socialLinks -confirmPassword -password  -isApprove -createdAt -updatedAt');
    },
    updatebrbuser: async (query, updateObj) => {
        return await brbuserModel.findOneAndUpdate(query, updateObj, { new: true }).select('-otp');
    },

    paginatebrbuserSearch: async (body) => {
        // brbuserType: { $ne: [brbuserType.ADMIN,brbuserType.SUBADMIN] }
        let query = { userType: { $nin: [userType.ADMIN, userType.SUBADMIN] } }
        const { page, limit, usersType1, search } = body;
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { _id: { $regex: search, $options: 'i' } },
                { status: { $regex: search, $options: 'i' } }
            ]
        }
        if (usersType1) {
            query.userType = usersType1
        }

        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await brbuserModel.paginate(query, options);
    },
    countTotalbrbUser: async (body) => {
        return await brbuserModel.countDocuments(body)
    }
}

module.exports = { brbuserServices }