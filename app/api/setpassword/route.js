import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        // ดึงค่า token จากคุกกี้ในคำขอ
        const cookie = request.headers.get('Cookie');
        const token = cookie.split(';').find(c => c.trim().startsWith('token=')).split('=')[1];

        // ตรวจสอบความถูกต้องของ token
        const decodedToken = jwt.verify(token, 'sohardtodecode');
        const { email } = decodedToken;

        // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        });
        // ดึงข้อมูลรหัสผ่านใหม่จาก request body
        const requestBody = await request.json();

        const passwordMatch = await bcrypt.compare(requestBody.password, user.password);

        if (!passwordMatch) {
            return new Response(JSON.stringify({ error: "รหัสผ่านเดิม ไม่ถูกต้อง กรุณาลองอีกครั้ง!" }), {
                headers: { "Content-Type": "application/json" },
                status: 400,
            });
        }
        // ตรวจสอบสิทธิ์ของผู้ใช้และอนุญาตให้เปลี่ยนรหัสผ่าน
        if (user.role === 'admin' || user.role === 'user') {
            // อนุญาตให้เปลี่ยนรหัสผ่าน

            const newPassword = requestBody.newPassword;

            // เข้ารหัสรหัสผ่านใหม่
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // อัปเดตรหัสผ่านในฐานข้อมูล
            await prisma.users.update({
                where: {
                    email: email
                },
                data: {
                    password: hashedPassword
                }
            });

            // ส่งการตอบกลับ
            return new Response(JSON.stringify({ success: 'Password updated' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200,
            });
        } else {
            // ไม่มีสิทธิ์ในการเปลี่ยนรหัสผ่าน
            return new Response(JSON.stringify({ error: 'Permission denied' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 403,
            });
        }
    } catch (error) {
        // หากเกิดข้อผิดพลาดในการตรวจสอบหรืออัปเดตรหัสผ่าน
        console.error('Error during password update:', error);
        return new Response(JSON.stringify({ error: 'Password not updated' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}
