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

        const Status = await prisma.$queryRaw`SELECT status FROM form WHERE cpe65_email = ${email} AND selected_months = ${String}`;

        if (Status === false) {
            console.log("Don't update paylists");
        } else {
            await prisma.$queryRaw`
                UPDATE paylists 
                SET
                    july = CASE WHEN 'july' = ANY(string_to_array(f.selected_months, ', ')) THEN 100 ELSE july END,
                    baisri = CASE WHEN 'baisri' = ANY(string_to_array(f.selected_months, ', ')) THEN 50 ELSE baisri END,
                    august = CASE WHEN 'august' = ANY(string_to_array(f.selected_months, ', ')) THEN 200 ELSE august END,
                    september = CASE WHEN 'september' = ANY(string_to_array(f.selected_months, ', ')) THEN 200 ELSE september END,
                    november = CASE WHEN 'november' = ANY(string_to_array(f.selected_months, ', ')) THEN 200 ELSE november END,
                    december = CASE WHEN 'december' = ANY(string_to_array(f.selected_months, ', ')) THEN 200 ELSE december END,
                    january = CASE WHEN 'january' = ANY(string_to_array(f.selected_months, ', ')) THEN 200 ELSE january END,
                    fabuary = CASE WHEN 'fabuary' = ANY(string_to_array(f.selected_months, ', ')) THEN 200 ELSE fabuary END
                FROM form f
                WHERE f.cpe65_email = ${email}
                AND f.status = true
                AND paylists.email = ${email}
            `;
        }


        return new Response(JSON.stringify({ message: "Update paylists" }), {
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