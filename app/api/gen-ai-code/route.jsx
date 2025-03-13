import { GenAiCode } from "@/configs/AiModel"
import { NextResponse } from "next/server"

export async function POST(req) {
    const {prompt} = await req.json()

   try {
    const result = await Promise.race([
        GenAiCode.sendMessage(prompt),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Request Timeout")), 10000)) // 10 sec timeout
    ]);
    const res = result.response.text();
    return NextResponse.json(JSON.parse(res));
} catch (e) {
    return NextResponse.json({ error: e.message });
}

}
