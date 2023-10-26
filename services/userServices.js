const userModel=require('../model/user.model');

const userServices={
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

    userList:async(query)=>{
        return await userModel.find(query).select('-otp -location -isOnline -coinBalance -isChange -otpExpireTime -firstTime -approveStatus -socialLinks -confirmPassword -password  -isApprove -createdAt -updatedAt');
    },
    updateUser: async (query, updateObj) => {
        return await userModel.findOneAndUpdate(query, updateObj, { new: true }).select('-otp');
    },
}

module.exports={userServices}