const Order = require("../models/Order");

// CREATE ORDER
const placeOrder = async (req, res) => {
  const { items, customerInfo } = req.body;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in the order.' });
    }

    // Calculate total price
    const totalPrice = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

    const newOrder = new Order({
      items,
      customerInfo,
      totalPrice,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
};

//GET ALL ORDERS

const getAllOrders = async(req,res) => {
    try {
        const orders = await Order.find().sort({ CreatedAt: -1 }); //newest first
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({message: "Failed to fetch orders", error: error.message});
    }
};


//GET order by id
const getOrderById = async(req,res) => {
    const {id} = req.params;

    try {
        const order = await Order.findById(id);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({message: "Failed to fetch the order", error: error.message});
    }
}

//Update Status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;             // order ID from URL
  const { status } = req.body;           // new status from request body

  // Validate status input
  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};



module.exports = {
    placeOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
};