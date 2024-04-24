import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { name, value } = body;

    if (!name || !value || !params.storeId) {
      return new NextResponse("Invalid Request", { status: 404 });
    }

    const storeByUid = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUid) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(color, { status: 200 });
  } catch (error) {
    console.error("[COLORS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const colors = await prismadb.color.findMany({
      where: { storeId: params.storeId },
    });

    return NextResponse.json(colors, { status: 200 });
  } catch (error) {
    console.error("[COLORS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
