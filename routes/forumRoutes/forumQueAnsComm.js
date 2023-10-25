const controller = require('../../controllers/forumController/forumQueAnsComm');
const schemas = require('../../utilities/schema.utilities');
const SchemaValidator = require('../../utilities/validations.utilities');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });
  
    app.post('/skyTrails/forumPost/createComment', SchemaValidator(schemas.forumQueAnsComm), controller.createComment);
    app.get('/skyTrails/forumPost/getPostComment',SchemaValidator(schemas.forumQueAnsgetSchemas), controller.getPostComment);
    app.put('/skyTrails/forumPost/updatePostComment', controller.updatePostComment);
    app.delete('/skyTrails/forumPost/deletePostComment', controller.deletePostComment);
    app.get('/skyTrails/forumPost/getPostCommentsOfUser',controller.getPostCommentsOfUser);
    app.post('/skyTrails/forumPost/likeComments',controller.likeComments);
}
