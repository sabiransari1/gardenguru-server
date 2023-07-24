const express = require("express");
const cartRoutes = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");

// cartRoutes.use(authMiddleware);

cartRoutes.get("/cartproducts", async (req, res) => {
  try {
    const existingUserID = req.body.userID;

    const cartProducts = await cartModel.find({
      userID: existingUserID,
    });
    return res.status(200).send(cartProducts);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

cartRoutes.post("/addtocart/:_id", async (req, res) => {
  try {
    const existingUserID = req.body.userID;
    const _id = req.params._id;
    const product = await productModel.findById(_id);

    const cartProduct = await cartModel.create({
      ...product._doc,
      userID: existingUserID,
    });

    cartProduct.populate();
    return res
      .status(200)
      .send({ msg: "Cart product has been added successfully", cartProduct });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

cartRoutes.delete("/delete/:_id", async (req, res) => {
  try {
    const existingUserID = req.body.userID;
    const _id = req.params._id;

    const product = await cartModel.findById(_id);

    if (product.userID.toString() === existingUserID) {
      const deletedCartProduct = await cartModel.findByIdAndDelete(_id);
      return res.status(200).send({
        msg: "Product has been deleted successfully",
        deletedCartProduct,
      });
    } else {
      return res.status(400).send({ msg: "Invaild user ID" });
    }
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

module.exports = cartRoutes;
