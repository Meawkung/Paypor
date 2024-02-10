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

        const sum = await prisma.$queryRaw`
        SELECT 
    SUM(
        CASE
            WHEN july = 0 THEN 100
            WHEN july = 100 THEN 0
            ELSE july
        END
    ) +
    SUM(
        CASE
            WHEN baisri = 0 THEN 50
            WHEN baisri = 50 THEN 0
            ELSE baisri
        END
    ) +
    SUM(
        CASE
            WHEN august = 0 THEN 200
            WHEN august = 200 THEN 0
            ELSE august
        END
    ) +
    SUM(
        CASE
            WHEN september = 0 THEN 200
            WHEN september = 200 THEN 0
            ELSE september
        END
    ) +
    SUM(
        CASE
            WHEN november = 0 THEN 200
            WHEN november = 200 THEN 0
            ELSE november
        END
    ) +
    SUM(
        CASE
            WHEN december = 0 THEN 200
            WHEN december = 200 THEN 0
            ELSE december
        END
    ) +
    SUM(
        CASE
            WHEN january = 0 THEN 200
            WHEN january = 200 THEN 0
            ELSE january
        END
    ) +
    SUM(
        CASE
            WHEN fabuary = 0 THEN 200
            WHEN fabuary = 200 THEN 0
            ELSE fabuary
        END
    ) AS total_sum
FROM 
    paylists
WHERE 
    email = ${decodedToken.email}
    `
    const totalSum = Number(sum[0].total_sum);

        return new Response(JSON.stringify({ totalSum : totalSum }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}
