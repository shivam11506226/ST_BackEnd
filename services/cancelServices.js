const cancelFlightBookingsModel = require("../model/cancelFlightBookings");
const cancelHotelModel = require("../model/cancelHotelBookings");
const cancelBusModel = require("../model/cancelBusBookings");
const status = require("../enums/status");
const bookingStatus = require("../enums/bookingStatus");
const mongoose = require('mongoose');
const cancelBookingServices = {
    createcancelFlightBookings: async (insertObj) => {
        return await cancelFlightBookingsModel.create(insertObj);
    },

    findAnd:async(object)=>{
        return await cancelFlightBookingsModel.find(object)
    },
    updatecancelFlightBookings: async (query, updateObj) => {
        return await cancelFlightBookingsModel.findOneAndUpdate(query, updateObj, { new: true }).select('-createdAt -updatedAt');
    },
    aggregatePaginatecancelFlightBookingsList: async (body) => {
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
                $lookup: {
                    from: "flightbookingdatas",
                    localField: 'flightBookingId',
                    foreignField: '_id',
                    as: "flightDetails",
                  }
              },
              {
                $unwind: {
                  path: "$flightDetails",
                  preserveNullAndEmptyArrays: true
                }
              },
              {
                $match: {
                    $or: [
                        { "flightDetails.AirlineName": { $regex: data, $options: "i" } },
                        { "userDetails.username": { $regex: data, $options: "i" } },
                        { "userDetails.email": { $regex: data, $options: "i" } },
                        { "flightDetails.paymentStatus": { $regex: data, $options: "i" } },
                        { "flightDetails.destination": { $regex: data, $options: "i" } },
                        { "flightDetails.dateOfJourney": { $regex: data, $options: "i" } },
                        { "bookingId": { $regex: data, $options: "i" } },
                        { "flightDetails.origin": { $regex: data, $options: "i" } },
                        { "flightDetails.amount": parseInt(data) }
                    ],
            }
        }
        ]
        if (fromDate) {
            pipeline.dateOfJourney = { $eq: fromDate };
        }
        if (toDate) {
            pipeline.createdAt = { $eq: toDate }
        }
        let aggregate = cancelFlightBookingsModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            sort: { createdAt: -1 },
        };
        const result= await cancelFlightBookingsModel.aggregatePaginate(aggregate, options)
        return result;
    },

    countTotalcancelFlightBookings: async () => {
        return await cancelFlightBookingsModel.countDocuments({ bookingStatus: bookingStatus.CANCEL })
    },

    createHotelCancelRequest: async (object) => {
        return await cancelHotelModel.create(object)
    },
    updateHotelCancelRequest: async (query, updateObj) => {
        return await cancelHotelModel.findOneAndUpdate(query, updateObj, { new: true })
    },
    getHotelCancelRequesrByAggregate: async (info) => {
        const { page, limit, search, fromDate, toDate } = info;
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
                        { "night": parseInt(data) },
                        { "room": parseInt(data) },
                        { "bookingStatus": { $regex: data, $options: "i" } }
                    ],
                }
            },
        ]
        if (fromDate) {
            pipeline.CheckInDate = { $eq: fromDate };
        }
        let aggregate = cancelHotelModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            sort: { createdAt: -1 },
        };
        console.log("aggregate========",aggregate)
        const result= await cancelHotelModel.aggregatePaginate(aggregate, options);
        return result;
    },
    countTotalHotelCancelled: async () => {
        return await cancelHotelModel.countDocuments({ bookingStatus: bookingStatus.CANCEL })
    },

    createBusCancelRequest: async (object) => {
        return await cancelBusModel.create(object)
    },
    updateBusCancelRequest: async (query, updateObj) => {
        return await cancelBusModel.findOneAndUpdate(query, updateObj, { new: true })
    },
    getBusCancelRequestByAggregate: async (info) => {
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
                        { "busId": parseInt(data) },
                        { "noOfSeats": parseInt(data) },
                        { "bookingStatus": { $regex: data, $options: "i" } },
                        { "destination": { $regex: data, $options: "i" } },
                        { "origin": { $regex: data, $options: "i" } },
                        { "pnr": { $regex: data, $options: "i" } },
                        { "busType": { $regex: data, $options: "i" } },
                    ],
                }
            },
        ]
        if (fromDate) {
            pipeline.dateOfJourney = { $eq: fromDate };
        }
        let aggregate = cancelBusModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            sort: { createdAt: -1 },
        };
        return await cancelBusModel.aggregatePaginate(aggregate, options)
    },
    countTotalBusCancelled: async () => {
        return await cancelBusModel.countDocuments({ bookingStatus: bookingStatus.CANCEL })
    },
}

module.exports = { cancelBookingServices }