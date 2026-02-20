import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const dynamic = 'force-dynamic';

const handler = toNextJsHandler(auth);

export async function GET(req: Request) {
    return handler.GET(req);
}

export async function POST(req: Request) {
    return handler.POST(req);
}
