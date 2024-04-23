import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Invalid Request", { status: 404 });
    }

    const body = await req.json();

    const { name, frontEndStoreUrl, stripeKey } = body;

    const store = await prismadb.store.update({
      where: {
        id: params.storeId,
      },
      data: {
        userId,
        stripeKey,
        frontEndStoreUrl,
        name,
      },
    });

    return NextResponse.json(store, { status: 200 });
  } catch (error) {
    console.log("STORE_PATCH", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Invalid Request", { status: 404 });
    }

    const deletedStore = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });

    return NextResponse.json(deletedStore, { status: 200 });
  } catch (error) {
    console.log("STORE_DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
