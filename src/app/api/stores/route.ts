import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { name, frontEndStoreUrl, stripeKey } = body;

    if (!stripeKey || !name || !frontEndStoreUrl) {
      return new NextResponse("Invalid Request", { status: 404 });
    }

    const store = await prismadb.store.create({
      data: {
        name: name,
        frontEndStoreUrl: frontEndStoreUrl,
        stripeKey: stripeKey,
        userId: userId,
      },
    });

    return NextResponse.json(store, { status: 200 });
  } catch (error) {
    console.error("[STORES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
