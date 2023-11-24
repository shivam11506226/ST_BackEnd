const changeBusRequestModel = require('../model/changeBusBookings');
const status = require("../enums/status");
const bookingStatus=require("../enums/bookingStatus");
const mongoose =require('mongoose');
const changeBusRequestServices = {
    createchangeBusRequest: async (insertObj) => {
        return await changeBusRequestModel.create(insertObj);
    },

    findchangeBusRequest: async (query) => {
        return await changeBusRequestModel.findOne(query).select('-createdAt -updatedAt');
    },

    getchangeBusRequest: async (query) => {
        return await changeBusRequestModel.findOne(query).select('-createdAt -updatedAt');
    },

    findchangeBusRequestData: async (query) => {
        return await changeBusRequestModel.findOne(query).select('-createdAt -updatedAt ');
    },

    deletechangeBusRequest: async (query) => {
        return await changeBusRequestModel.deleteOne(query);
    },

    changeBusRequestList: async (query) => {
        return await changeBusRequestModel.find(query).populate('userId').select('-createdAt -updatedAt');
    },
    updatechangeBusRequest: async (query, updateObj) => {
        return await changeBusRequestModel.findOneAndUpdate(query, updateObj, { new: true }).select('-createdAt -updatedAt');
    },

    paginatechangeBusRequestSearch: async (body) => {
        // changeBusRequestType: { $ne: [changeBusRequestType.ADMIN,changeBusRequestType.SUBADMIN] }
        let query = {}
        const { page, limit, search } = body;
        if (search) {
            query.$or = [
                { BusName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ]
        }

        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await changeBusRequestModel.paginate(query, options);
    },

    aggregatePaginatechangeBusRequestList: async (body) => {
        const { page, limit, search, fromDate, toDate } = body;
        if (search) {
            var filter = search;
        }
        let data = filter || ""
        let pipeline = [
            {
                $lookup: {
                    from: "userb2bs",
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
            {
                $match: {
                    $or: [
                        { "BusName": { $regex: data, $options: "i" }, },
                        { "userDetails.username": { $regex: data, $options: "i" } },
                        { "userDetails.email": { $regex: data, $options: "i" } },
                        { "paymentStatus": { $regex: data, $options: "i" } },
                        { "destination": { $regex: data, $options: "i" } },
                        { "night": parseInt(data) },
                        { "room": parseInt(data) },
                        { "bookingStatus": { $regex: data, $options: "i" } }
                    ],
                }
            },
        ]
        if (fromDate && !toDate) {
            pipeline.CheckInDate = { $eq: fromDate };
        }
        if (!fromDate && toDate) {
            pipeline.CheckOutDate = { $eq: toDate };
        }
        if (fromDate && toDate) {
            pipeline.$and = [
                { CheckInDate: { $eq: fromDate } },
                { CheckOutDate: { $eq: toDate } },
            ]
        }
        let aggregate = changeBusRequestModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 5,
            sort: { createdAt: -1 },
        };
        return await changeBusRequestModel.aggregatePaginate(aggregate, options)

    },

    countTotalchangeBusRequest:async()=>{
        return await changeBusRequestModel.countDocuments({bookingStatus:bookingStatus.BOOKED})
    },
}

module.exports = { changeBusRequestServices }