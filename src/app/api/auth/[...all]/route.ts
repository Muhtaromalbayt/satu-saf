import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const dynamic = 'force-dynamic';

const handler = toNextJsHandler(auth);

export async function GET(req: Request) {
    console.log(`[AUTH] GET ${req.url}`);
    try {
        return await handler.GET(req);
    } catch (err) {
        console.error(`[AUTH ERROR] GET ${req.url}:`, err);
        throw err;
    }
}

export async function POST(req: Request) {
    console.log(`[AUTH] POST ${req.url}`);
    try {
        return await handler.POST(req);
    } catch (err) {
        console.error(`[AUTH ERROR] POST ${req.url}:`, err);
        throw err;
    }
}
