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
        case 'gpt-3.5-turbo':
        postUrl=`${process.env.OPENAI_PROXY}/${endpoint}`
        authKey=`Bearer ${process.env.OPENAI_API_KEY}`
            break;
        case 'gpt-4-turbo':
        postUrl=`${process.env.OPENAI4_PROXY}/${endpoint}`
        authKey=`Bearer ${process.env.OPENAI4_API_KEY}`
            break;
        case 'gpt-4':
        postUrl=`${process.env.BING_PROXY}/${endpoint}`
        authKey=`Bearer ${process.env.BING_API_KEY}`
            break;
    }    
    // if (openAIBody.model==='gpt-3.5-turbo') {
    //     const res = await fetch(`${process.env.OPENAI_PROXY}/${endpoint}`, {
    //         method: 'POST',
    //         headers: {
    //             Authorization: key === undefined ? `Bearer ${process.env.OPENAI_API_KEY}` : `Bearer ${key}`,
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(openAIBody),
    //     })
    
    //     if (!res.ok) {
    //         return handleErr(res)
    //     }
    //     return streamResponse(res, openaiParser)
    // }else{
    //     const res = await fetch(`${process.env.OPENAI4_PROXY}/${endpoint}`, {
    //         method: 'POST',
    //         headers: {
    //             Authorization: key === undefined ? `Bearer ${process.env.OPENAI4_API_KEY}` : `Bearer ${key}`,
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(openAIBody),
    //     })        
    //     if (!res.ok) {
    //         return handleErr(res)
    //     }
    //     return streamResponse(res, openaiParser)
    // }
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