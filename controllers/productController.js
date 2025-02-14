const Company = require("../models/Company.js");
const Product = require("../models/Product.js");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("company");

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "Hiç ürün bulunamadı.",
      });
    }

    res.status(200).json({
      success: true,
      totalCount: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ürünler getirilirken bir hata oluştu.",
      error: error.message,
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    if (!req.body.company) {
      return res.status(400).json({
        success: false,
        message: "Bir şirket (company) belirtmelisiniz.",
      });
    }

    const existingCompany = await Company.findById(req.body.company);
    if (!existingCompany) {
      return res.status(400).json({
        success: false,
        message: "Belirtilen şirket bulunamadı.",
      });
    }

    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ürün oluşturulurken bir hata oluştu.",
      error: error.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("company");
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Ürün bulunamadı." });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ürün getirilirken bir hata oluştu.",
      error: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Belirtilen ID ile bir ürün bulunamadı.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ürün başarıyla güncellendi.",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ürün güncellenirken bir hata oluştu.",
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Ürün bulunamadı." });
    }
    res.json({ success: true, message: "Ürün başarıyla silindi." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ürün silinirken bir hata oluştu.",
      error: error.message,
    });
  }
};

exports.productSearch = async (req, res) => {
  try {
    const key = req.params.key;

    const products = await Product.find({
      productName: { $regex: new RegExp(key, "i") },
    }).populate("company");

    res.status(200).json({
      success: true,
      message: "Arama başarıyla tamamlandı.",
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ürün aranırken bir hata oluştu.",
      error: error.message,
    });
  }
};
