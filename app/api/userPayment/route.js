import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function GET(request) {

    try {
        const cookieHeader = request.headers.get('Cookie');
        const tokenCookie = cookieHeader.split(';').find(cookie => cookie.trim().startsWith('token='));

        // ตรวจสอบว่ามี token cookie หรือไม่
        if (!tokenCookie) {
            return new Response(JSON.stringify({ error: 'Token cookie not found' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 400,
            });
        }

        // แยกค่า token จากข้อมูล cookie
        const token = tokenCookie.split('=')[1];

        // ตรวจสอบความถูกต้องของ token
        const decodedToken = jwt.verify(token, 'sohardtodecode');

        const payment = await prisma.$queryRaw`SELECT
        id,
        'july' AS month, july AS amount
    FROM
        paylists
    WHERE
        email = ${decodedToken.email}
    UNION ALL
    SELECT
        id,
        'baisri' AS month, baisri AS amount
    FROM
        paylists
    WHERE
        email = ${decodedToken.email}
    UNION ALL
    SELECT
        id,
        'august' AS month, august AS amount
    FROM
        paylists
    WHERE
        email = ${decodedToken.email}
    UNION ALL
    SELECT
        id,
        'september' AS month, september AS amount
    FROM
        paylists
    WHERE
        email = ${decodedToken.email}
    UNION ALL
    SELECT
        id,
        'november' AS month, november AS amount
    FROM
        paylists
    WHERE
        email = ${decodedToken.email}
    UNION ALL
    SELECT
        id,
        'december' AS month, december AS amount
    FROM
        paylists
    WHERE
        email = ${decodedToken.email}
    UNION ALL
    SELECT
        id,
        'january' AS month, january AS amount
    FROM
        paylists
    WHERE
        email = ${decodedToken.email}
    UNION ALL
    SELECT
        id,
        'fabuary' AS month, fabuary AS amount
    FROM
        paylists
    WHERE
        email = ${decodedToken.email};
      `;

        return new Response(JSON.stringify({ payment }), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to retrieve users' }), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 500,
        });
    }

}