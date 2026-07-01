import Order from "../models/order.models.js";
import Post from "../models/post.models.js";

export async function PlaceOrder(req, res) {
  try {
    const userId = req.user.id;
    const { products, shippingAddress, paymentMethod } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        message: "No products found",
      });
    }

    let totalAmount = 0;
    const orderProducts = [];
    const productsToUpdate = [];

    for (const item of products) {
      const post = await Post.findById(item.id);

      if (!post) {
        return res.status(404).json({
          message: `Product with id ${item.id} not found`,
        });
      }

      if (post.stock < item.quantity) {
        return res.status(400).json({
          message: `${post.title} has only ${post.stock} items available`,
        });
      }

      totalAmount += post.price * item.quantity;

      orderProducts.push({
        product: post._id,
        quantity: item.quantity,
        price: post.price,
      });

      productsToUpdate.push({
        post,
        quantity: item.quantity,
      });
    }

    const order = await Order.create({
      user: userId,
      products: orderProducts,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
    });

    for (const item of productsToUpdate) {
      item.post.stock -= item.quantity;
      await item.post.save();
    }

    return res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getOrders(req, res) {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId }).populate('products.product');
        return res.status(200).json({ orders });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}
export async function getOrderById(req, res) {
    try{
        const userId = req.user.id;
        const orderId = req.params.id;
        const order=await Order.findOne({_id:orderId,user:userId}).populate('products.product');
        if(!order)
        {
            return res.status(404).json({
                message:"Order not found"
            })

        }
        return res.status(200).json({
            message:"Order fetched successfully",
            order
        })
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}
export async function cancelOrder(req,res)
{
    try{
        const userId=req.user.id;
        const orderId=req.params.id;
        const order=await Order.findOne({_id:orderId,user:userId});  
         
    }
}