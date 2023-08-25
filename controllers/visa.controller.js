const visadata =  require( "../model/visadata.model");
const {
    actionCompleteResponse,
    sendActionFailedResponse,
  } = require("../common/common");


  exports.createVisa= async (req,res)=>{
   const {name,email,mobile,destination,visaType} = req.body;
 
   try {
    const response = await visadata.create({name,email,mobile,destination,visaType});
    const msg = "visa created successfully"
    actionCompleteResponse(res,response,msg)
   } catch (error) {
    sendActionFailedResponse(res,{},error.message);
   }
}; 

exports.getAllVisa = async (req,res)=>{
  try {
   const response = await visadata.find();
   const msg = "visa get successfully"
   actionCompleteResponse(res,response,msg)
  } catch (error) {
   sendActionFailedResponse(res,{},error.message);
  }
};
