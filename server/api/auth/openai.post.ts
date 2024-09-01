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
    let postUrl=''
    let authKey=''
    switch (openAIBody.model) {
        case 'claude-3-5-sonnet-20240620':
        postUrl=`${process.env.cloud35_PROXY}/${endpoint}`
        authKey=`Bearer ${process.env.claude35_API_KEY}`
            break;
        case 'gpt-4-turbo':
        postUrl=`${process.env.OPENAI4_PROXY}/${endpoint}`
        authKey=`Bearer ${process.env.OPENAI4_API_KEY}`
            break;
        case 'gpt-4o':
        postUrl=`${process.env.OPENAI4o_PROXY}/${endpoint}`
        authKey=`Bearer ${process.env.OPENAI4o_API_KEY}`
            break;
        case 'gpt-4o-mini':
        postUrl=`${process.env.OPENAI4omini_PROXY}/${endpoint}`
        authKey=`Bearer ${process.env.OPENAI4omini_API_KEY}`
            break;
        case 'gpt-4':
        postUrl=`${process.env.BING_PROXY}/${endpoint}`
        authKey=`Bearer ${process.env.BING_API_KEY}`
            break;
        case 'spark':
        postUrl=`${process.env.XUNFEI_PROXY}/${endpoint}`
        authKey=`Bearer ${process.env.XUNFEI_KEY}`
            break;
        case 'step':
        postUrl=`${process.env.YUEWEN_PROXY}/${endpoint}`
        authKey=`Bearer ${process.env.YUEWEN_KEY}`
            break;
        case 'kimi':
        postUrl=`${process.env.KIMI_PROXY}/${endpoint}`
        authKey=`Bearer ${process.env.KIMI_KEY}`
            break;
    }    
    const res = await fetch(postUrl, {
        method: 'POST',
        headers: {
            Authorization: key === undefined ? authKey : `Bearer ${key}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(openAIBody),
    })        
    if (!res.ok) {
        return handleErr(res)
    }
    return streamResponse(res, openaiParser)

})