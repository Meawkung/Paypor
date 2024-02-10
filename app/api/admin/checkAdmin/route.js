import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        // ดึงค่า token จากคุกกี้ในคำขอ
        const cookie = request.headers.get('Cookie');
        const token = cookie.split(';').find(c => c.trim().startsWith('token=')).split('=')[1];

        // ตรวจสอบความถูกต้องของ token
        const decodedToken = await verifyToken(token);

        // ตรวจสอบสิทธิ์ของผู้ใช้
        if (decodedToken.role === 'admin') {
            // หากผู้ใช้มีสิทธิ์เป็นแอดมิน
            const users = await prisma.users.findMany({
                where: {
                    role: 'admin'
                }
            });

            return new Response(JSON.stringify({ users, isAdmin: true }), {
                headers: {
                    'Content-Type': 'application/json',
                },
                status: 200,
            });
        } else {
            // หากผู้ใช้ไม่มีสิทธิ์เป็นแอดมิน
            return new Response(JSON.stringify({ error: 'Permission denied' }), {
                headers: {
                    'Content-Type': 'application/json',
                },
                status: 403,
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to retrieve users' }), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 500,
        });
    }
}

// ฟังก์ชันสำหรับตรวจสอบความถูกต้องของ token
async function verifyToken(token) {
    const SECRET_KEY = 'sohardtodecode'; // คีย์ลับสำหรับสร้าง token
    return await jwt.verify(token, SECRET_KEY);
}
