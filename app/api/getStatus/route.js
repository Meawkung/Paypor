import { PrismaClient } from "@prisma/client";

import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(request) {
    try {

        const cookieHeader = request.headers.get("Cookie");
        const tokenCookie = cookieHeader.split(";").find((cookie) => cookie.trim().startsWith("token="));

        // ตรวจสอบว่ามี token cookie หรือไม่
        if (!tokenCookie) {
            return new Response(JSON.stringify({ error: "Token cookie not found" }), {
                headers: { "Content-Type": "application/json" },
                status: 400,
            });
        }

        // แยกค่า token จากข้อมูล cookie
        const token = tokenCookie.split("=")[1];

        // ตรวจสอบความถูกต้องของ token
        const decodedToken = jwt.verify(token, "sohardtodecode");


        const data = await prisma.$queryRaw`
            SELECT status, cpe65_email 
            FROM form 
            WHERE cpe65_email = ${decodedToken.email}`;

        const result = {};

        data.forEach(item => {
            const email = item.cpe65_email;
            const status = item.status;

            // ตรวจสอบว่า email ยังไม่มีอยู่ในอ็อบเจกต์ result หรือไม่
            if (!result[email]) {
                result[email] = []; // สร้างอาร์เรย์เปล่าสำหรับเก็บ status ของ email นั้นๆ
            }

            result[email].push(status); // เพิ่ม status เข้าไปในอาร์เรย์ของ email นั้นๆ
        });

        return new Response(JSON.stringify(result), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}