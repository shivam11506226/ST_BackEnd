const multer = require('multer');
const path = require('path');
 const { v4: uuidv4 } = require('uuid');
const { badRequest, internalServerError } = require('./responceCode'); // Correct the path to your response code module

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Customize the file name to include a timestamp and remove spaces
    cb(null, `uploadedFile_${Date.now()}_${file.originalname.replace(/\s/g, '')}`);
  }
});

// Initialize multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 } // Set file size limit (optional)
}).single('filename');

// Middleware to handle file uploads
const handleFileUpload = (req, res,next,upload) => {
  try{
    upload(req,res, async(err)=>{
        //console.log("fileData",req.file)
        if(!req.file){
            return res.status(400).json({success:false, message:"No file uploaded"});
     }  
               if(err){
                return res.status(400).json({success:false,message:"there is error no file uploading"});
               }
               // save data into database
               const fileData = new File({
                fileName:req.file.filename,
                uuid:uuidv4(),
                path:req.file.path,
                size:req.file.size

               });
               
             
                 const result =  await fileData.save();
                //  console.log(result,"nn")
                    return res.json({file:`${process.env.Host}/api/file/${result.uuid}`});        
    })


}catch(error){
//   console.log(error,"bb")
 return res.status(500).json({success:false, message:"Internal server error!",error});
}
};

module.exports = { upload, handleFileUpload };
