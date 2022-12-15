const express = require("express");
const cart = require("../schemas/cart");
const router = express.Router()

// /routes/goods.js
const goods = [
  {
    goodsId: 4,
    name: "상품 4",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
    category: "drink",
    price: 0.1,
  },
  {
    goodsId: 3,
    name: "상품 3",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
    category: "drink",
    price: 2.2,
  },
  {
    goodsId: 2,
    name: "상품 2",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
    category: "drink",
    price: 0.11,
  },
  {
    goodsId: 1,
    name: "상품 1",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
    category: "drink",
    price: 6.2,
  },
];

// 상품 목록 조회 API
router.get("/goods", (req,res) => {
  res.status(200).json({goods})
})


// 상품 상세 조회 API
router.get("/goods/:goodsId", (req,res) => {
  const {goodsId} = req.params
  const [detail] = goods.filter((goods) => Number(goodsId) === goods.goodsId)
  res.status(200).json({detail})
})

// 상품을 장바구니에 추가 API
const Cart = require("../schemas/cart.js")
router.post("/goods/:goodsId/cart", async(req,res) =>{
  const {goodsId} = req.params
  const {quantity} = req.body

  const exitsCarts = await Cart.find({goodsId})
  if (exitsCarts.length) {
    return res.status(400).json({
      success:false, 
      errorMessage:"이미 장바구니에 해당하는 상품이 존재합니다",
    })
  }

  await Cart.create({goodsId, quantity})

  res.json({result:"success"})
})

//장바구니 안에 있는 것을 수정
router.put("/goods/:goodsId/cart", async(req,res) =>{
  const {goodsId} = req.params
  const {quantity} = req.body

  const exitsCarts = await Cart.find({goodsId})
  if (exitsCarts.length) {
    await Cart.updateOne(
      {goodsId:goodsId}, //왼쪽:오른쪽 왼쪽은 찾는다/오른쪽은 수정할애
      {$set:{quantity:quantity}} // 바꿀거다 왼쪽애 있는 애를 오른쪽 애로
      )
  }
  res.status(200).json({success:true})
})

//상품제거
router.delete("/goods/:goodsId/cart", async(req,res) =>{
  const {goodsId} = req.params

  const exitsCarts = await Cart.find({goodsId})
  if (exitsCarts.length){
    await Cart.deleteOne({goodsId})
  }

  res.json({result:"success"})
})

// 상품 입력? API
const Goods = require("../schemas/goods");
router.post("/goods", async (req, res) => {
        const { goodsId, name, thumbnailUrl, category, price } = req.body;

  const goods = await Goods.find({ goodsId });
  if (goods.length) {
    return res.status(400).json({ success: false, errorMessage: "이미 있는 데이터입니다." });
  }

  const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price });

  res.json({ goods: createdGoods });
});

module.exports = router