const { authJwt } = require("../Middleware");
const { verifySignUp } = require("../Middleware");
const UserController = require("../Controllers/UserController");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  // Create a new user
  app.post(
    "/api/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
    UserController.createUser
  );

  // Edit a user by ID
  app.put(
    "/api/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin], // Add any necessary middleware for validation and authorization
    UserController.editUser
  );

  // Delete a user by ID
  app.delete(
    "/api/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin], // Add any necessary middleware for validation and authorization
    UserController.deleteUser
  );

  // Get a list of all users
  app.get(
    "/api/users", 
    [authJwt.verifyToken, authJwt.isAdmin], 
    UserController.getAllUsers
    );

  // Get a user by ID
  app.get(
    "/api/users/:id", 
    [authJwt.verifyToken, authJwt.isEventOrganizerOrAdmin],
    UserController.getUserById
    );
};
