const flightBookingModel = require('../../model/flightBookingData.model');
const userType = require("../../enums/userType");
const status = require("../../enums/status");

const userflightBookingServices = {
    createUserflightBooking: async (insertObj) => {
        return await flightBookingModel.create(insertObj);
    },

    findUserflightBooking: async (query) => {
        return await flightBookingModel.findOne(query)
    },

    getUserflightBooking: async (query) => {
        return await flightBookingModel.findOne(query)
    },

    findUserflightBookingData: async (query) => {
        return await flightBookingModel.findOne(query)
    },

    deleteUserflightBooking: async (query) => {
        return await flightBookingModel.deleteOne(query);
    },

    userflightBookingList: async (query) => {
        return await flightBookingModel.find(query)
    },
    updateUserflightBooking: async (query, updateObj) => {
        return await flightBookingModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    paginateUserflightBookingSearch: async (body) => {
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
        return await flightBookingModel.paginate(query, options);
    },
    countTotalUser: async (body) => {
        return await flightBookingModel.countDocuments(body)
    }
}

module.exports = { userflightBookingServices }