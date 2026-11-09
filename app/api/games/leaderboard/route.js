import {NextResponse} from 'next/server';
import pool from '@/lib/db';

//GET METHOD: Fetches top 10 scores sorted by moves, followed by time
export async function GET() {
    try {
        const [rows] = await pool.query(
            'SELECT id, player_name, moves, time_seconds, created_at FROM leaderboard ORDER BY moves ASC, time_seconds ASC LIMIT 10'
        );
        return NextResponse.json({success: true, data: rows}); 
    }

    catch (error) {
        return NextResponse.json({error: 'Failed to fetch leaderboard'}, {status: 500});
    }
}

//POST METHOD: Saves and adds new score entry 
export async function POST(request) {
    try {
        const {player_name, moves, time_seconds} = await request.json();
    

    if (!player_name || moves === undefined || time_seconds === undefined) {
        return NextResponse.json({error: 'Missing required fields'}, {status: 400});
    }

    const [result] = await pool.query(
        'INSERT INTO leaderboard (player_name, moves, time_seconds) VALUES (?, ?, ?)',
    [player_name, moves, time_seconds]
    );

    return NextResponse.json({message: 'Score saved successfully!', id: result.insertId}, {status: 201});
}

    catch (error) {
        console.error('Database POST Error: ', error);
        return NextResponse.json({error: 'Failed to save score'}, {status: 500});
    }
}