const userModel = require('../model/user.model');
const userType = require("../enums/userType");
const status = require("../enums/status");
const userServices = {
    createUser: async (insertObj) => {
        return await userModel.create(insertObj);
    },

    findUser: async (query) => {
        return await userModel.findOne(query).select('-otp -isApproved -roles ');
    },

    getUser: async (query) => {
        return await userModel.findOne(query).select('-otp -location -isOnline -coinBalance -isChange -otpExpireTime -firstTime');
    },

    findUserData: async (query) => {
        return await userModel.findOne(query).select('-createdAt -updatedAt -roles -password -isOnline -firstTime -isApproved');
    },

    deleteUser: async (query) => {
        return await userModel.deleteOne(query);
    },

    userList: async (query) => {
        return await userModel.find(query).select('-otp -location -isOnline -coinBalance -isChange -otpExpireTime -firstTime -approveStatus -socialLinks -confirmPassword -password  -isApprove -createdAt -updatedAt');
    },
    updateUser: async (query, updateObj) => {
        return await userModel.findOneAndUpdate(query, updateObj, { new: true }).select('-otp');
    },

    paginateUserSearch: async (body) => {
        // userType: { $ne: [userType.ADMIN,userType.SUBADMIN] }
        let query = {userType:{ $nin: [userType.ADMIN, userType.SUBADMIN] }}
        const { page, limit, usersType1, search } = body;
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
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
        return await userModel.paginate(query, options);
    },
    countTotalUser:async(body)=>{
        return await userModel.countDocuments(body)
    }
}

module.exports = { userServices }