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

        const admin = await prisma.$queryRaw`SELECT * FROM form WHERE status = false`;

        return new Response(JSON.stringify(admin), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}