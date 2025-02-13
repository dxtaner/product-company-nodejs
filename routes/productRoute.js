const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController.js");
const authMiddleware = require("../middlewares/auth/authMiddleware");

router.get("/", productController.getAllProducts);

router.post(
  "/",
  authMiddleware.authenticateToken,
  productController.createProduct
);

router.get("/:id", productController.getProductById);

router.put(
  "/:id",
  authMiddleware.authenticateToken,
  productController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware.authenticateToken,
  productController.deleteProduct
);

router.get("/product-search/:key", productController.productSearch);

module.exports = router;
