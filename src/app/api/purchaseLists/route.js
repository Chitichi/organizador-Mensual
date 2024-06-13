import { connectDB } from "@/libs/mongodb";
import PurchaseList from "@/models/purchaseList";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const purchaseLists = await PurchaseList.find();
    return NextResponse.json(purchaseLists, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch purchase lists", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    if (!data || typeof data !== "object") {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const purchaseList = new PurchaseList(data);
    await purchaseList.validate();

    const createdPurchaseList = await PurchaseList.create(data);
    return NextResponse.json(createdPurchaseList, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create purchase list", error: error.message },
      { status: 500 }
    );
  }
}
