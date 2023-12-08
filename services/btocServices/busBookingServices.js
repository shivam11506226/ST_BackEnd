const userBusBookingModel = require('../../model/btocModel/busBookingModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");

//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const userBusBookingServices = {
    createUserBusBooking: async (insertObj) => {
        return await userBusBookingModel.create(insertObj);
    },

    findUserBusBooking: async (query) => {
        return await userBusBookingModel.findOne(query)
    },

    getUserBusBooking: async (query) => {
        return await userBusBookingModel.findOne(query)
    },

    findUserBusBookingData: async (query) => {
        return await userBusBookingModel.findOne(query)
    },

    deleteUserBusBooking: async (query) => {
        return await userBusBookingModel.deleteOne(query);
    },

    userBusBookingList: async (query) => {
        return await userBusBookingModel.find(query)
    },
    updateUserBusBooking: async (query, updateObj) => {
        return await userBusBookingModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    paginateUserBusBookingSearch: async (body) => {
        // userType: { $ne: [userType.ADMIN,userType.SUBADMIN] }
        let query = { userType: { $nin: [userType.ADMIN, userType.SUBADMIN] } }
        const { page, limit, usersType1, search } = body;
        if (search) {
            query.$or = [
                // { username: { $regex: search, $options: 'i' } },
                // { email: { $regex: search, $options: 'i' } },
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
        return await userBusBookingModel.paginate(query, options);
    },
    countTotalUser: async (body) => {
        return await userBusBookingModel.countDocuments(body)
    }
}

module.exports = { userBusBookingServices }