import { NextResponse } from "next/server";
import Razorpay from "razorpay";

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
    const { phone } = await request.json();
    const subscribers = await subscriber.find({ phone });

    if (subscribers?.length === 0)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json({ subscribers }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
