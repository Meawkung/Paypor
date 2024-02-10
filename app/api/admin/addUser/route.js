import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        // ดึงค่า token จากคุกกี้ในคำขอ
        const cookie = request.headers.get('Cookie');
        const token = cookie.split(';').find(c => c.trim().startsWith('token=')).split('=')[1];

        // ตรวจสอบความถูกต้องของ token
        const decodedToken = jwt.verify(token, 'sohardtodecode');
        const emailUser = decodedToken.email;

        // ค้นหาผู้ใช้จากฐานข้อมูลโดยใช้ email
        const user = await prisma.users.findUnique({
            where: {
                email: emailUser
            }
        });

        // ตรวจสอบสิทธิผู้ใช้
        if (user.role === 'admin') {
            const { email, password, role } = await request.json();

            // อัปเดตข้อมูลผู้ใช้
            await prisma.users.create({
                data: {
                    email,
                    password,
                    role
                }
            });

            return new Response(JSON.stringify({ success: 'Data updated successfully' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200,
            });
        } else {
            // ผู้ใช้ไม่มีสิทธิ์เป็นแอดมิน ไม่สามารถอัปเดตข้อมูลได้
            return new Response(JSON.stringify({ error: 'Permission denied' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 403,
            });
        }
    } catch (error) {
        console.error('Error during data update:', error);
        return new Response(JSON.stringify({ error: 'Failed to update data' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}
