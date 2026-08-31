//     toolName -> toolname from types
//     planType -> tool_plan , map and check if plan exists for the tool
//     monthlySpend -> num
//     teamSize -> num
//     primaryUseCase -> primary_use_case from constant

import { TOOL_PLANS, PRIMARY_USE_CASES } from "../lib/audit/constants";
import type { Plan, ToolName, UseCase, ToolFormData } from "../lib/audit/types";

export function validateTool(input: ToolFormData): {valid: boolean; errors: string} {
   
    const { toolName, planType, monthlySpend, teamSize } = input;
    const primaryUseCase = (input as Record<string, unknown>).primaryUseCase as string;

    // check toolName 
    if(!toolName || !(toolName in TOOL_PLANS)){
        return {valid: false, errors: "Invalid tool name"};
    }

    // check plan
    const validPlans = TOOL_PLANS[toolName as ToolName] as readonly Plan[];
    if(!planType || !validPlans.includes(planType as Plan<ToolName>)){
        return {valid: false, errors: "Invalid plan type for the selected tool"};
    }

    // check monthlySpend
    if(monthlySpend === "" || monthlySpend < 0){
        return {valid: false, errors: "Monthly spend must be a non-negative number"};
    }

    // check teamSize
    if(teamSize === "" || teamSize <= 0){
        return {valid: false, errors: "Team size must be a positive number"};
    }

    // check primaryUseCase
    const useCaseCheck = validateUseCase(primaryUseCase);
    if (!useCaseCheck.valid) {
        return useCaseCheck;
    }
    return {valid: true, errors: ""};
}

export function validateUseCase(useCase: string): {valid: boolean; errors: string} {
    // check useCase
    if(!useCase || !PRIMARY_USE_CASES.includes(useCase as UseCase)){
        return {valid: false, errors: "Invalid primary use case"};
    }
    return {valid: true, errors: ""};
}