const cancelFlightBookingsModel = require("../../model/btocModel/cancelFlightTicketModel");
const cancelHotelModel = require("../../model/btocModel/cancelHotelTicketModel");
const cancelBusModel = require("../../model/btocModel/cancelBusTicketModel");
const status = require("../../enums/status");
const bookingStatus = require("../../enums/bookingStatus");
const mongoose = require('mongoose');

//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const cancelUserBookingServices = {
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
                $lookup: {
                    from: "userflightBookingDetail",
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
    // aggregatePaginatecancelFlightBookingsList: async (body) => {
    //     const { page, limit, search, fromDate, toDate } = body;
    //     if (search) {
    //         var filter = search;
    //     }
    //     let data = filter || ""
    //     let pipeline = [
    //         {
    //             $lookup: {
    //                 from: "users",
    //                 localField: 'userId',
    //                 foreignField: '_id',
    //                 as: "userDetails",
    //             }
    //         },
    //         {
    //             $unwind: {
    //                 path: "$userDetails",
    //                 preserveNullAndEmptyArrays: true
    //             }
    //         },
    //           {
    //             $lookup: {
    //                 from: "flightbookingdatas",
    //                 localField: 'flightBookingId',
    //                 foreignField: '_id',
    //                 as: "flightDetails",
    //               }
    //           },
    //           {
    //             $unwind: {
    //               path: "$flightDetails",
    //               preserveNullAndEmptyArrays: true
    //             }
    //           },
    //           {
    //             $match: {
    //                 $or: [
    //                     { "flightDetails.AirlineName": { $regex: data, $options: "i" } },
    //                     { "userDetails.username": { $regex: data, $options: "i" } },
    //                     { "userDetails.email": { $regex: data, $options: "i" } },
    //                     { "flightDetails.paymentStatus": { $regex: data, $options: "i" } },
    //                     { "flightDetails.destination": { $regex: data, $options: "i" } },
    //                     { "flightDetails.dateOfJourney": { $regex: data, $options: "i" } },
    //                     { "bookingId": { $regex: data, $options: "i" } },
    //                     { "flightDetails.origin": { $regex: data, $options: "i" } },
    //                     { "flightDetails.amount": parseInt(data) }
    //                 ],
    //         }
    //     }
    //     ]
    //     if (fromDate) {
    //         pipeline.dateOfJourney = { $eq: fromDate };
    //     }
    //     if (toDate) {
    //         pipeline.createdAt = { $eq: toDate }
    //     }
    //     let aggregate = cancelFlightBookingsModel.aggregate(pipeline)
    //     let options = {
    //         page: parseInt(page) || 1,
    //         limit: parseInt(limit) || 10,
    //         sort: { createdAt: -1 },
    //     };
    //     const result= await cancelFlightBookingsModel.aggregatePaginate(aggregate, options)
    //     return result;
    // },
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
                $lookup:{
                    from: "userHotelBookingDetail",
                    localField: 'hotelBookingId',
                    foreignField: '_id',
                    as: "hotelDetails",
                }
            },
            {
                $unwind: {
                    path: "$hotelDetails",
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

    getBusData:async(data)=>{
return await cancelBusModel.find(data);
    },
    getBusCancelRequestByAggregate: async (body) => {
        const { page, limit, search, fromDate, toDate } = body;
        if (search) {
            var filter = search;
        }
        let data = filter || ""
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
            {
                $lookup: {
                    from: "userbusBookingDetail",
                    localField: 'busBookingId',
                    foreignField: '_id',
                    as: "busDetails",
                }
            },
            {
                $unwind: {
                    path: "$busDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    $or: [
                        { "busDetails.AirlineName": { $regex: data, $options: "i" } },
                        { "userDetails.username": { $regex: data, $options: "i" } },
                        { "userDetails.email": { $regex: data, $options: "i" } },
                        { "busDetails.paymentStatus": { $regex: data, $options: "i" } },
                        { "busDetails.destination": { $regex: data, $options: "i" } },
                        { "busDetails.dateOfJourney": { $regex: data, $options: "i" } },
                        { "bookingId": { $regex: data, $options: "i" } },
                        { "busDetails.origin": { $regex: data, $options: "i" } },
                        { "busDetails.amount": parseInt(data) }
                    ],
                }
            }
        ]
        if (fromDate) {
            pipeline.push({ $match: { "busDetails.dateOfJourney": { $eq: fromDate } } });
        }

        if (toDate) {
            pipeline.push({ $match: { "busDetails.createdAt": { $eq: toDate } } });
        }

        pipeline.push({
            $sort: { createdAt: -1 },
        });

        let aggregate = cancelBusModel.aggregate(pipeline);
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
        };

        const result = await cancelBusModel.aggregatePaginate(aggregate, options);
        return result;
    },
    countTotalBusCancelled: async () => {
        return await cancelBusModel.countDocuments({ bookingStatus: bookingStatus.CANCEL })
    },
}

module.exports = { cancelUserBookingServices }