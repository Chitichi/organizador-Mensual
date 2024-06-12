import { connectDB } from "@/libs/mongodb";
import PurchaseList from "@/models/purchaseList";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const purchaseLists = await PurchaseList.find();
  return NextResponse.json(purchaseLists);
}

export async function POST(request) {
  await connectDB();
  const data = await request.json();

  const purchaseLists = await PurchaseList.create(data);
  return NextResponse.json(purchaseLists);
}
