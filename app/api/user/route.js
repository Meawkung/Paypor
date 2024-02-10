import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        // ดึงค่า token จาก cookie ในคำขอ
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

        // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
        const user = await prisma.$queryRaw`SELECT * FROM cpe65 WHERE email = ${decodedToken.email}`;

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 404,
            });
        }

        // ส่งข้อมูลผู้ใช้กลับในรูปแบบ JSON
        return new Response(JSON.stringify({ user }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error('Error retrieving user data:', error);
        return new Response(JSON.stringify({ error: 'Failed to retrieve user data' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}
