import * as crypto from "crypto";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import getRawBody from "raw-body";
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

const isConnected = () => {
  const { readyState } = mongoose.connection;
  return readyState === 1 || readyState === 2;
};

const connectToDatabase = async () => {
  if (!isConnected()) {
    await mongoose.connect(process.env.DB);
  }
};

const subscriberSchema = new mongoose.Schema(
  {
    phone: String,
    method: String,
    amount: Number,
    paymentId: String,
    currency: String,
    status: String,
    order_id: String,
    tax: Number,
    fee: Number,
    captured: Boolean,
  },
  { timestamps: true }
);

const subscriber =
  mongoose.models.subscriber || mongoose.model("subscriber", subscriberSchema);
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const signature = request.headers.get("x-razorpay-signature");

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
      .update(JSON.stringify(body))
      .digest("hex");

    if (signature === expectedSignature) {
      if (body.event === "payment.captured") {
        const payment = body.payload.payment.entity;
        await subscriber.create({
          phone: payment.contact.replace("+91", ""),
          method: payment.method,
          amount: payment.amount / 100,
          paymentId: payment.id,
          currency: payment.currency,
          status: payment.status,
          order_id: payment.order_id,
          tax: payment.tax / 100,
          fee: payment.fee / 100,
          captured: payment.captured,
        });
        console.log("Payment captured:", payment);

        return NextResponse.json({ status: "ok" }, { status: 200 });
      } else {
        return NextResponse.json({ error: "Unhandled event" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  return NextResponse.json({ orderId: "order.id" }, { status: 401 });
}
