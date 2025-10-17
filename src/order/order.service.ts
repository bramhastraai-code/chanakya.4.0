// src/orders/orders.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './entities/order.entity';
import { InjectRazorpay } from 'nestjs-razorpay';
import Razorpay from 'razorpay';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectRazorpay() private readonly razorpay: Razorpay,
  ) {}

  async findAll(
    pageSize: string,
    pageNumber: string,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'asc',
    searchQuery?: string, // Optional search query parameter
    status?: string, // Optional filter by order status
  ): Promise<{
    orders: Order[];
    totalPages: number;
    totalOrders: number;
    pageSize: number;
    pageNumber: number;
  }> {
    try {
      // Parse pagination values
      const limit = parseInt(pageSize, 10);
      const skip = (parseInt(pageNumber, 10) - 1) * limit;

      // Sort options
      const sortOptions: { [key: string]: 1 | -1 } = {};
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Build search filter
      const searchFilter: any = searchQuery
        ? {
            $or: [
              { userId: { $regex: searchQuery, $options: 'i' } },
              { receipt: { $regex: searchQuery, $options: 'i' } },
              { orderId: { $regex: searchQuery, $options: 'i' } },
            ],
          }
        : {};

      // Filter by status if provided
      if (status && status !== 'all') {
        searchFilter.status = status;
      }

      // Get total orders count
      const totalOrders = await this.orderModel
        .countDocuments(searchFilter)
        .exec();

      // Fetch paginated orders
      const orders = await this.orderModel
        .find(searchFilter)
        .populate('userId')
        .populate('planId')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec();

      // Calculate total pages
      const totalPages = Math.ceil(totalOrders / limit);

      // Return paginated results
      return {
        orders,
        totalPages,
        totalOrders,
        pageSize: limit,
        pageNumber: parseInt(pageNumber, 10),
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }
    return order;
  }

  //----------------------//----------------------//----------------------
  async createOrder(
    userId: string,
    amount: number,
    planId: string,
  ): Promise<Order> {
    const options = {
      amount: amount * 100, // Razorpay requires the amount in paise
      currency: 'INR',
      receipt: 'receipt_' + Math.random().toString(36).substring(7),
    };
    console.log(userId, amount, options);

    const razorpayOrder = await this.razorpay.orders.create(options);

    const order = new this.orderModel({
      userId,
      planId,
      amount: Number(razorpayOrder.amount) / 100,
      currency: options.currency,
      receipt: options.receipt,
      orderId: razorpayOrder.id,
      status: 'pending',
    });

    return await order.save();
  }

  async updateOrderStatus(
    orderId: string,
    status: string,
    paymentDetails: any,
  ) {
    return await this.orderModel.findOneAndUpdate(
      { orderId },
      { status, paymentDetails },
      { new: true },
    );
  }

  async getUserOrders(userId: string) {
    return await this.orderModel.find({ userId }).exec();
  }
}
