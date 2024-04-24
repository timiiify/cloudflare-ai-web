import {handleErr, openaiParser, streamResponse} from "~/utils/helper";
import {OpenAIBody, OpenAIReq} from "~/utils/types";

export default defineEventHandler(async (event) => {
    const body: OpenAIReq = await readBody(event)
    const {model, endpoint, messages, key} = body

    const openAIBody: OpenAIBody = {
        stream: true,
        model,
        messages,
    }    
    if (openAIBody.model==='gpt-3.5-turbo') {
        const res = await fetch(`${process.env.OPENAI_PROXY}/${endpoint}`, {
            method: 'POST',
            headers: {
                Authorization: key === undefined ? `Bearer ${process.env.OPENAI_API_KEY}` : `Bearer ${key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(openAIBody),
        })
    
        if (!res.ok) {
            return handleErr(res)
        }
        return streamResponse(res, openaiParser)
    }else{
        const res = await fetch(`${process.env.OPENAI4_PROXY}/${endpoint}`, {
            method: 'POST',
            headers: {
                Authorization: key === undefined ? `Bearer ${process.env.OPENAI4_API_KEY}` : `Bearer ${key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(openAIBody),
        })        
        if (!res.ok) {
            return handleErr(res)
        }
        return streamResponse(res, openaiParser)
    }

})