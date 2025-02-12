const mongoose = require("mongoose");

const CompanySchema = mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  companyLegalNumber: {
    type: String,
    required: true,
    unique: true,
  },
  country: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Company = mongoose.model("Company", CompanySchema);
module.exports = Company;
