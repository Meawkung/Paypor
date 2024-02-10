import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const { publicUrl, month } = await request.json(); // Extract publicUrl from request body
        const url = publicUrl.data.publicUrl

        const jsonObject = JSON.parse(month); //แปลงข้อมูลจาก string ให้เป็น JSON
        const monthArray = jsonObject.month; // ดึงข้อมูลที่ต้องการออกมาแค่ข้อมูลใน month
        const Data = monthArray.join(', ') // แปลงข้อมูลใน month ให้เป็น string และใช้ , คั่นระหว่างข้อมูล

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

        const createdData = await prisma.$queryRaw`INSERT INTO form (file_loc, cpe65_email, status, selected_months) VALUES (${url}, ${decodedToken.email}, false, ${Data})`;

        return new Response(JSON.stringify(createdData), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        console.error('Error fetching user data:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}