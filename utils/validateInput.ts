//     toolName -> toolname from types
//     planType -> tool_plan , map and check if plan exists for the tool
//     monthlySpend -> num
//     teamSize -> num
//     primaryUseCase -> primary_use_case from constant

import { TOOL_PLANS, PRIMARY_USE_CASES } from "../lib/audit/constants";
import { Plan, ToolName, UseCase } from "../lib/audit/types";

type Input<T extends ToolName> = {
    toolName: T;
    planType: Plan<T>;
    monthlySpend: number | "";
    teamSize: number | "";
    primaryUseCase: UseCase | "";
}

export function validateInput<T extends ToolName>(input: Input<T>): {valid: boolean; errors: string} {
   
    const{toolName, planType, monthlySpend, teamSize, primaryUseCase} = input;

    // check toolName 
    if(!toolName || !(toolName in TOOL_PLANS)){
        return {valid: false, errors: "Invalid tool name"};
    }

    // check planType
    const validPlans = TOOL_PLANS[toolName as ToolName] as readonly Plan[];
    if(!planType || !validPlans.includes(planType as Plan<T>)){
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
    if(!primaryUseCase || !PRIMARY_USE_CASES.includes(primaryUseCase as UseCase)){
        return {valid: false, errors: "Invalid primary use case"};
    }
    return {valid: true, errors: ""};
}