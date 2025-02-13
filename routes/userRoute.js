const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const authMiddleware = require("../middlewares/auth/authMiddleware.js");

router.post("/auth/register", userController.register);
router.post("/auth/login", userController.login);
router.get("/checkUser/:id", userController.checkUser);
router
  .route("/dashboard")
  .get(authMiddleware.authenticateToken, userController.getDashboard);
router.get("/totalUsers", userController.getTotalUsers);
router.get("/", userController.getUsers);
router.delete(
  "/:id",
  authMiddleware.authenticateToken,
  userController.deleteUser
);

module.exports = router;
