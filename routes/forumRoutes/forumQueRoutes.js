const controller = require('../../controllers/forumController/forumQueController');
const schemas = require('../../utilities/schema.utilities');
const SchemaValidator = require('../../utilities/validations.utilities');
const { authJwt } = require("../../middleware");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });
    app.post('/skyTrails/forumPost/createPost',[authJwt.verifcationToken], SchemaValidator(schemas.forumQueSchema), controller.createPost);
    app.post('/skyTrails/forumPost/addBookmark',controller.addBookmark)
    app.get('/skyTrails/forumPost/getPost', controller.getPost);
    app.put('/skyTrails/forumPost/updatePost', controller.updatePost);
    app.delete('/skyTrails/forumPost/deletePost', controller.deletePost);
    app.get('/skyTrails/forumPost/getTopStories',controller.getTopStories);
    app.get('/skyTrails/forumPost/getPostByID',controller.getPostByID);}
