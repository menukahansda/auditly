// validate -> run engine -> return result
import {NextResponse, NextRequest} from 'next/server';
import {validateInput} from '@/utils/validateInput';
import {generateAudit} from '@/lib/audit/engine';
import { UserInput } from '@/lib/audit/types';

export async function POST(request: NextRequest){
    const userInput = await request.json();
    const data: UserInput = {
        tools: userInput.tools,
        useCase: userInput.useCase,
    };
    data.tools.forEach(tool =>{
        const validated : {valid: boolean, errors: string} = 
            validateInput({
                ...tool, 
                useCase: data.useCase
            });
            
        if(!validated.valid){
            return NextResponse.json({error: validated.errors}, {status: 400});
        }
    })
    
    const result = await generateAudit(data);
    return NextResponse.json(result);
}
