const changeHotelRequestModel = require('../model/changeHotelBookings');
const status = require("../enums/status");
const bookingStatus=require("../enums/bookingStatus");
const mongoose =require('mongoose');
const changeHotelRequestServices = {
    createchangeHotelRequest: async (insertObj) => {
        return await changeHotelRequestModel.create(insertObj);
    },

    findchangeHotelRequest: async (query) => {
        return await changeHotelRequestModel.findOne(query).select('-createdAt -updatedAt');
    },

    getchangeHotelRequest: async (query) => {
        return await changeHotelRequestModel.findOne(query).select('-createdAt -updatedAt');
    },

    findchangeHotelRequestData: async (query) => {
        return await changeHotelRequestModel.findOne(query).select('-createdAt -updatedAt ');
    },

    deletechangeHotelRequest: async (query) => {
        return await changeHotelRequestModel.deleteOne(query);
    },

    changeHotelRequestList: async (query) => {
        return await changeHotelRequestModel.find(query).populate('userId').select('-createdAt -updatedAt');
    },
    updatechangeHotelRequest: async (query, updateObj) => {
        return await changeHotelRequestModel.findOneAndUpdate(query, updateObj, { new: true }).select('-createdAt -updatedAt');
    },

    paginatechangeHotelRequestSearch: async (body) => {
        // changeHotelRequestType: { $ne: [changeHotelRequestType.ADMIN,changeHotelRequestType.SUBADMIN] }
        let query = {}
        const { page, limit, search } = body;
        if (search) {
            query.$or = [
                { hotelName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ]
        }

        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await changeHotelRequestModel.paginate(query, options);
    },

    aggregatePaginatechangeHotelRequestList: async (body) => {
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
                        { "hotelName": { $regex: data, $options: "i" }, },
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
        let aggregate = changeHotelRequestModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 5,
            sort: { createdAt: -1 },
        };
        return await changeHotelRequestModel.aggregatePaginate(aggregate, options)

    },

    countTotalchangeHotelRequest:async()=>{
        return await changeHotelRequestModel.countDocuments({bookingStatus:bookingStatus.BOOKED})
    },
}

module.exports = { changeHotelRequestServices }