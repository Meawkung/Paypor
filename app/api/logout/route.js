export async function POST(request) {
    try {
        // Clear token cookie from client-side
        const cookie = `token=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`;

        // Return success response with cleared cookie
        return new Response(JSON.stringify({ success: "Logout success" }), {
            headers: { 
                "Content-Type": "application/json",
                "Set-Cookie": cookie,
            },
            status: 200,
        });
    } catch (error) {
        console.error("Error during logout:", error);
        return new Response(JSON.stringify({ error: "Failed to logout" }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
}
