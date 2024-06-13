import { connectDB } from "@/libs/mongodb";
import PurchaseList from "@/models/purchaseList";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const purchaseList = await PurchaseList.findById(id);

    if (!purchaseList) {
      return NextResponse.json(
        { message: "Purchase list not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(purchaseList, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch purchase list", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const data = await request.json();
    const { id } = params;

    // Validate data
    if (!data || typeof data !== "object") {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const updatedPurchaseList = await PurchaseList.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updatedPurchaseList) {
      return NextResponse.json(
        { message: "Purchase list not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPurchaseList, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update purchase list", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deletedPurchaseList = await PurchaseList.findByIdAndDelete(id);

    if (!deletedPurchaseList) {
      return NextResponse.json(
        { message: "Purchase list not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Purchase list deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete purchase list", error: error.message },
      { status: 500 }
    );
  }
}
