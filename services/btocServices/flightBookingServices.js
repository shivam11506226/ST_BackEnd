const flightBookingModel = require('../../model/btocModel/flightBookingModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoose = require('mongoose')
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
            limit: Number(limit) || 10,
            sort: { createdAt: -1 },
        };
        return await flightBookingModel.paginate(query, options);
    },
    countTotalUser: async (body) => {
        return await flightBookingModel.countDocuments(body)
    },

    aggregatePaginateGetBooking: async (query) => {
        const { toDate, fromDate, userId, page, limit, search } = query;
       
        if (search) {
            var filter = search;
        }
        let data = filter || "";
        let pipeline = [
            {
                $match: {
                    userId: mongoose.Types.ObjectId(userId)
                }

            },
            {
                $lookup: {
                    from: "users",
                    localField: 'userId',
                    foreignField: '_id',
                    as: "userDetails",
                }
            },
            {
                $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
        ]
        if (fromDate && toDate) {
            pipeline.push({
                $match: {
                    $and: [
                        { CheckInDate: { $eq: new Date(fromDate) } },
                        { CheckOutDate: { $eq: new Date(toDate) } },
                    ]
                }
            });
        } else if (fromDate) {
            pipeline.push({
                $match: { CheckInDate: { $eq: new Date(fromDate) } }
            });
        } else if (toDate) {
            pipeline.push({
                $match: { CheckOutDate: { $eq: new Date(toDate) } }
            });
        }
        let aggregate = flightBookingModel.aggregate(pipeline);
        console.log("aggregate========>>>>>>>", aggregate)
        const options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: { createdAt: -1 },
        };
        const result = await flightBookingModel.aggregatePaginate(aggregate, options);
        console.log("=--------=-=-=--------", result);
        return result;
    },
    aggregatePaginateGetBooking1: async (query) => {
        const { toDate, fromDate, userId, page, limit, search } = query;
       
        if (search) {
            var filter = search;
        }
        let data = filter || "";
        let pipeline = [
           
            {
                $lookup: {
                    from: "users",
                    localField: 'userId',
                    foreignField: '_id',
                    as: "userDetails",
                }
            },
            {
                $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
        ]
        if (fromDate && toDate) {
            pipeline.push({
                $match: {
                    $and: [
                        { CheckInDate: { $eq: new Date(fromDate) } },
                        { CheckOutDate: { $eq: new Date(toDate) } },
                    ]
                }
            });
        } else if (fromDate) {
            pipeline.push({
                $match: { CheckInDate: { $eq: new Date(fromDate) } }
            });
        } else if (toDate) {
            pipeline.push({
                $match: { CheckOutDate: { $eq: new Date(toDate) } }
            });
        }
        let aggregate = flightBookingModel.aggregate(pipeline);
        console.log("aggregate========>>>>>>>", aggregate)
        const options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: { createdAt: -1 },
        };
        const result = await flightBookingModel.aggregatePaginate(aggregate, options);
        console.log("=--------=-=-=--------", result);
        return result;
    }
}

module.exports = { userflightBookingServices }