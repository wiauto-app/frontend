import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!API_URL) {
    return NextResponse.json({ ok: false, message: "API_URL no configurada" }, { status: 500 });
  }

  try {
    const response = await fetch(`${API_URL}/v1/vehicles/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, message: "Error del backend", status: response.status },
        { status: response.status },
      );
    }

    const body = await response.json();
    return NextResponse.json(body);
  } catch {
    return NextResponse.json({ ok: false, message: "Error de conexión" }, { status: 502 });
  }
}
