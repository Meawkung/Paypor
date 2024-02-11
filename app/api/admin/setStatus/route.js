import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function POST(request) {
    try {
        const { Status, email, month } = await request.json()

        const jsonObject = JSON.parse(month);
        const monthString = jsonObject.month;
        const monthArray = monthString.split(', ');
        const String = monthArray.join(', ');

        const cookieHeader = request.headers.get('Cookie')
        const tokenCookie = cookieHeader.split(';').find(cookie => cookie.trim().startsWith('token='))

        if (!tokenCookie) {
            return new Response(JSON.stringify({ error: 'Token cookie not found' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        await prisma.$queryRaw`
            UPDATE form
            SET status = ${Status}
            WHERE cpe65_email = ${email} AND selected_months = ${String}
        `

        return new Response(JSON.stringify({ message: 'Status updated' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        })


    } catch (error) {
        console.error('Error fetching user data:', error)
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        })
    }
}

