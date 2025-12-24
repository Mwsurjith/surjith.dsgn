import { NextResponse } from 'next/server';

export async function GET() {
    const apiKey = process.env.NEXT_PUBLIC_TIMEZONEDB_API_KEY || process.env.TIMEZONEDB_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { status: 'ERROR', message: 'API key not configured on server' },
            { status: 500 }
        );
    }

    try {
        const url = `https://api.timezonedb.com/v2.1/list-time-zone?key=${apiKey}&format=json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`TimezoneDB responded with status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('TimezoneDB Proxy Error:', error);
        return NextResponse.json(
            { status: 'ERROR', message: error.message },
            { status: 500 }
        );
    }
}
