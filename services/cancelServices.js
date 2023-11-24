const cancelBookingModel=require("../model/cancelFlightBookings");
const status = require("../enums/status");
const bookingStatus=require("../enums/bookingStatus");
const mongoose =require('mongoose');
const cancelBookingServices = {
    createcancelBooking: async (insertObj) => {
        return await cancelBookingModel.create(insertObj);
    },

    updatecancelBooking: async (query, updateObj) => {
        return await cancelBookingModel.findOneAndUpdate(query, updateObj, { new: true }).select('-createdAt -updatedAt');
    },

    
    aggregatePaginatecancelBookingList: async (body) => {
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
        let aggregate = cancelBookingModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 5,
            sort: { createdAt: -1 },
        };
        return await cancelBookingModel.aggregatePaginate(aggregate, options)

    },

    countTotalcancelBooking:async()=>{
        return await cancelBookingModel.countDocuments({bookingStatus:bookingStatus.BOOKED})
    },
}

module.exports = { cancelBookingServices }