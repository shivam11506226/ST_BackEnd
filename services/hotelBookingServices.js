const hotelBookingModel = require('../model/hotelBooking.model');
const status = require("../enums/status");
const bookingStatus=require("../enums/bookingStatus");
const mongoose =require('mongoose');
const hotelBookingServicess = {
    createhotelBooking: async (insertObj) => {
        return await hotelBookingModel.create(insertObj);
    },

    findhotelBooking: async (query) => {
        return await hotelBookingModel.findOne(query).select('-createdAt -updatedAt');
    },

    gethotelBooking: async (query) => {
        return await hotelBookingModel.findOne(query).select('-createdAt -updatedAt');
    },

    findhotelBookingData: async (query) => {
        return await hotelBookingModel.findOne(query).select('-createdAt -updatedAt ');
    },

    deletehotelBooking: async (query) => {
        return await hotelBookingModel.deleteOne(query);
    },

    hotelBookingList: async (query) => {
        return await hotelBookingModel.find(query).populate('userId').select('-createdAt -updatedAt');
    },
    updatehotelBooking: async (query, updateObj) => {
        return await hotelBookingModel.findOneAndUpdate(query, updateObj, { new: true }).select('-createdAt -updatedAt');
    },

    paginatehotelBookingSearch: async (body) => {
        // hotelBookingType: { $ne: [hotelBookingType.ADMIN,hotelBookingType.SUBADMIN] }
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
        return await hotelBookingModel.paginate(query, options);
    },

    aggregatePaginateHotelBookingList: async (body) => {
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
        let aggregate = hotelBookingModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 5,
            sort: { createdAt: -1 },
        };
        return await hotelBookingModel.aggregatePaginate(aggregate, options)

    },

    countTotalBooking:async()=>{
        return await hotelBookingModel.countDocuments({bookingStatus:bookingStatus.BOOKED})
    },
    aggregatePaginateHotelBookingList1: async (body) => {
        const { page, limit, search, fromDate, toDate,userId } = body;
        if (search) {
            var filter = search;
        }
        let data = filter || ""
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
        let aggregate = hotelBookingModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 5,
            sort: { createdAt: -1 },
        };
        return await hotelBookingModel.aggregatePaginate(aggregate, options)

    },

    aggregatePaginateHotelBookingList1: async (body) => {
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
        let aggregate = hotelBookingModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 5,
            sort: { createdAt: -1 },
        };
        return await hotelBookingModel.aggregatePaginate(aggregate, options)

    },
}

module.exports = { hotelBookingServicess }