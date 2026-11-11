import {NextResponse} from 'next/server';
import pool from '@/lib/db';

//GET METHOD: Fetches top 10 scores sorted by moves, followed by time
export async function GET() {
    try {
        const [rows] = await pool.query(
            'SELECT id, player_name AS playerNane, moves, time_seconds AS timeSeconds, created_at AS createdAt FROM leaderboard ORDER BY moves ASC, time_seconds ASC LIMIT 10'
        );
        return NextResponse.json({success: true, data: rows}); 
    }

    catch (error) {
        console.error('Database GET Error: ', error)
        return NextResponse.json({error: error.message, code: error.code, sqlMessage: error.sqlMessage}, {status: 500});
    }
}

//POST METHOD: Saves and adds new score entry 
export async function POST(request) {
    try {
        const body = await request.json();

        //Accepts both types of cases for incoming request
        const playerName = body.playerName || body.player_name;
        const moves = body.moves;
        const timeSeconds = body.timeSeconds !== undefined ? body.timeSeconds:body.time_seconds;
    

    if (!playerName || moves === undefined || timeSeconds === undefined) {
        return NextResponse.json({error: 'Missing required fields'}, {status: 400});
    }

    const [result] = await pool.query(
        'INSERT INTO leaderboard (player_name, moves, time_seconds) VALUES (?, ?, ?)',
    [playerName, moves, timeSeconds]
    );

    return NextResponse.json({message: 'Score saved successfully!', id: result.insertId}, {status: 201});
}

    catch (error) {
        console.error('Database POST Error: ', error);
        return NextResponse.json({error: 'Failed to save score'}, {status: 500});
    }
}