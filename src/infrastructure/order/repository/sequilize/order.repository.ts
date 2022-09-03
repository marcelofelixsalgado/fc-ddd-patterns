import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import ProductModel from "../../../product/repository/sequelize/product.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {

    await OrderModel.update(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        where: { id: entity.id }     
      }
    );
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({ 
      where: { id },
      include: [ { model: OrderItemModel, include:[ProductModel]  } ],
    });
    
    const orderItemsModels = orderModel.items.map((orderItemModel) => 
      new OrderItem(orderItemModel.id, orderItemModel.name, orderItemModel.product.price, orderItemModel.product_id, orderItemModel.quantity)
    );

    return new Order(orderModel.id, orderModel.customer_id, orderItemsModels);
  }

  async findAll(): Promise<Order[]> {
    const ordertModels = await OrderModel.findAll({
      include: [ { model: OrderItemModel, include:[ProductModel]  } ]
    });

    return ordertModels.map((orderModel) => {
      const orderItemsModels = orderModel.items.map((orderItemModel) => 
        new OrderItem(orderItemModel.id, orderItemModel.name, orderItemModel.product.price, orderItemModel.product_id, orderItemModel.quantity)
      );
      return new Order(orderModel.id, orderModel.customer_id, orderItemsModels)
    });
  }  
}
