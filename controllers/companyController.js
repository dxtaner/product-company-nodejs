const Company = require("../models/Company");

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();

    res.status(200).json({
      success: true,
      message: "Şirketler başarıyla getirildi.",
      totalCount: companies.length,
      data: companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Şirketler getirilirken bir hata oluştu.",
      error: error.message,
    });
  }
};

exports.createCompany = async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).json({ success: true, data: company });
  } catch (error) {
    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.companyLegalNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "Bu yasal numara ile kayıtlı bir şirket zaten mevcut.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Şirket oluşturulurken bir hata oluştu.",
      error: error.message,
    });
  }
};

exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Şirket bulunamadı." });
    }
    res.json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Şirket getirilirken bir hata oluştu.",
      error: error.message,
    });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id;

    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCompany) {
      return res.status(404).json({
        success: false,
        message: "Belirtilen ID ile bir şirket bulunamadı.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Şirket başarıyla güncellendi.",
      data: updatedCompany,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Şirket güncellenirken bir hata oluştu.",
      error: error.message,
    });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Şirket bulunamadı." });
    }
    res.json({ success: true, message: "Şirket başarıyla silindi." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Şirket silinirken bir hata oluştu.",
      error: error.message,
    });
  }
};

exports.companySearch = async (req, res) => {
  try {
    const key = req.params.key;

    const companies = await Company.find({
      companyName: { $regex: new RegExp(key, "i") },
    });

    res.status(200).json({
      success: true,
      message: "Şirket araması başarıyla tamamlandı.",
      count: companies.length,
      data: companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Şirket aranırken bir hata oluştu.",
      error: error.message,
    });
  }
};
