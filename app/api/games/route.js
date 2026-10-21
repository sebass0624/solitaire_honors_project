import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const games = await db.game.findMany({
        include: {player: true},
        });
        return NextResponse.json({success: true, data: games});
    } catch (error) {
        return NextResponse.json(
        {success: false, error: error.message},
        {status: 500}
        );
    }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {username, boardStateJson} = body;

    const player = await db.player.upsert({
      where: {username: username || "anonymous"},
      update: {},
      create: {username: username || "anonymous"},
    });

    const newGame = await db.game.create({
      data: {
        playerId: player.id,
        boardStateJson: boardStateJson || "{}",
      },
    });

    return NextResponse.json({success: true, data: newGame }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}