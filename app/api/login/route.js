import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        // ค้นหาผู้ใช้โดยใช้อีเมล์
        const user = await prisma.users.findUnique({
            where: {
                email: email,
            },
        });

        // ถ้าไม่พบผู้ใช้
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                headers: { "Content-Type": "application/json" },
                status: 404,
            });
        }

        // ตรวจสอบรหัสผ่าน
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return new Response(JSON.stringify({ error: "Invalid password" }), {
                headers: { "Content-Type": "application/json" },
                status: 400,
            });
        }

        // สร้าง token
        const token = jwt.sign({ email: user.email, role: user.role}, 'sohardtodecode', { expiresIn: '1d' });

        // เก็บ token ในคุกกี้
        const cookie = `token=${token}; Path=/; HttpOnly; SameSite=Strict`; // ตั้งค่าคุกกี้
        
        // ส่งคำตอบกับคุกกี้ไปยังผู้ใช้
        return new Response(JSON.stringify({ success: "Login success", token }), {
            headers: {
                "Content-Type": "application/json",
                "Set-Cookie": cookie,
            },
            status: 200,
        });
    } catch (error) {
        console.error("Error during login:", error);
        return new Response(JSON.stringify({ error: "Failed to login" }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
}
