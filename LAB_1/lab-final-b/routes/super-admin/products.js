const express = require("express");
let Product = require("../../models/Product");
let router = express.Router();
const multer = require("multer");
const path = require("path");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/uploaded");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// GET - render create form
router.get("/products/create", (req, res) => {
  res.render("super-admin/products/create");
});

// POST - handle form submission
router.post("/products/create", upload.single("image"), async (req, res) => {
  try {
    const { name, price, color, department, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const newProduct = new Product({
      name,
      price,
      color,
      department,
      description,
      image,
    });

    await newProduct.save();
    req.flash("success", "Product created successfully");
    res.redirect("/super-admin/products");
  } catch (err) {
    console.error("Error creating product:", err);
    req.flash("danger", "Failed to create product");
    res.status(500).send("Failed to create product");
  }
});

router.get("/products/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.flash("success", "Product deleted successfully");
    res.redirect("/super-admin/products");
  } catch (err) {
    console.error("Error deleting product:", err);
    req.flash("danger", "Failed to delete product");
    res.status(500).send("Failed to delete product");
  }
});

router.get("/products/edit/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash("danger", "Product not found");
      return res.status(404).send("Product not found");
    }

    res.render("super-admin/products/edit", { product });
  } catch (err) {
    console.error("Error fetching product for edit:", err);
    req.flash("danger", "Internal Server Error");
    res.status(500).send("Internal Server Error");
  }
});

// POST - update product
router.post("/products/edit/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, color, department, description } = req.body;
    const updateData = { name, price, color, department, description };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);
    req.flash("success", "Product updated successfully");
    res.redirect("/super-admin/products");
  } catch (err) {
    console.error("Error updating product:", err);
    req.flash("danger", "Failed to update product");
    res.status(500).send("Failed to update product");
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.render("super-admin/products/list", { products });
  } catch (err) {
    console.error("Error fetching products:", err);
    req.flash("danger", "Error fetching products");
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

