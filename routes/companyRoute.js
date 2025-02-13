const express = require("express");
const companyController = require("../controllers/companyController.js");
const authMiddleware = require("../middlewares/auth/authMiddleware.js");

const router = express.Router();

router.get("/", companyController.getAllCompanies);
router.post(
  "/",
  authMiddleware.authenticateToken,
  companyController.createCompany
);
router.get("/:id", companyController.getCompany);
router.put(
  "/:id",
  authMiddleware.authenticateToken,
  companyController.updateCompany
);
router.delete(
  "/:id",
  authMiddleware.authenticateToken,
  companyController.deleteCompany
);

router.get("/company-search/:key", companyController.companySearch);

module.exports = router;
