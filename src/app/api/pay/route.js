import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
   });
   

export async function POST(request) {
  const { paymentId } = await request.json();

  const payment = await razorpay.payments.fetch(paymentId)
  console.log(payment);
  return NextResponse.json({ payment }, { status: 200 });
}
