const hotelBookingModel = require('../../model/btocModel/hotelBookingModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const userhotelBookingModelServices = {
    createUserhotelBookingModel: async (insertObj) => {
        return await hotelBookingModel.create(insertObj);
    },

    findUserhotelBookingModel: async (query) => {
        return await hotelBookingModel.findOne(query)
    },

    getUserhotelBookingModel: async (query) => {
        return await hotelBookingModel.findOne(query)
    },

    findUserhotelBookingModelData: async (query) => {
        return await hotelBookingModel.findOne(query)
    },

    deleteUserhotelBookingModel: async (query) => {
        return await hotelBookingModel.deleteOne(query);
    },

    userhotelBookingModelList: async (query) => {
        return await hotelBookingModel.find(query)
    },
    updateUserhotelBookingModel: async (query, updateObj) => {
        return await hotelBookingModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    paginateUserhotelBookingModelSearch: async (body) => {
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
        return await hotelBookingModel.paginate(query, options);
    },
    countTotalhotelBooking: async (body) => {
        return await hotelBookingModel.countDocuments(body)
    }
}

module.exports = { userhotelBookingModelServices }