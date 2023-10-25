const status = require("../enums/status");
const forumQueModel=require("../model/forum/forumQue")


const forumQueServices={
    createforumQue: async (insertObj) => {
        return await forumQueModel.create(insertObj);
    },

    findforumQue: async (query) => {
        return await forumQueModel.findOne(query);
    },

    findforumQueData: async (query) => {
        return await forumQueModel.find(query);
    },

    deleteforumQue: async (query) => {
        return await forumQueModel.deleteOne(query);
    },

   
    updateforumQue: async (query, updateObj) => {
        return await forumQueModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    forumQueListLookUp: async (body) => {
        const { search, page, limit, questionId,userId} = body;
        if (search) {
          var filter = search;
        }
        let data = filter || ""
        let searchData = [
          {
            $match:{isAnyComment:false}
          },
          {
            $lookup: {
              from: "users",
              localField: 'userId',
              foreignField: '_id',
              as: "userDetail",
            }
          },
          {
            $unwind: {
              path: "$userDetail",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $match: {
                content: { $regex: data, $options: "i" }
            }
          },
         
        ]
        if (questionId) {
          searchData.push({
            $match: { "questionsData.questionId": mongoose.Types.ObjectId(questionId) }
          })
        }
        if(userId){
            searchData.push({
                $match: { "userDetail.userId": mongoose.Types.ObjectId(userId) }
              })
        }
        let aggregate = forumQueModel.aggregate(searchData)
        console.log("aggregate============",aggregate);
        let options = {
          page: parseInt(page, 10) || 1,
          limit: parseInt(limit, 10) || 10,
          sort: { createdAt: -1 },
        };
        const info=await forumQueModel.aggregatePaginate(aggregate, options);
        console.log("info==========",info);
        return info;
      }
}

module.exports={forumQueServices}