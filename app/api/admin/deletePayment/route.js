import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const cookieHeader = request.headers.get("Cookie");
        const tokenCookie = cookieHeader.split(";").find((cookie) => cookie.trim().startsWith("token="));

        const { email, month } = await request.json();

        const jsonObject = JSON.parse(month);
        const monthString = jsonObject.month;
        const monthArray = monthString.split(', ');
        const String = monthArray.join(', ');

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

        if (decodedToken.role !== "admin") {
            return new Response(JSON.stringify({ error: "Permission denied" }), {
                headers: { "Content-Type": "application/json" },
                status: 400,
            });
        }

        const data = await prisma.$queryRaw`DELETE FROM form WHERE cpe65_email = ${email} AND selected_months = ${String}`;

        return new Response(JSON.stringify({ message: "Payment deleted" }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
}


