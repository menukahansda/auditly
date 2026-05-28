import { describe, expect, it } from "vitest";
import { validateInput } from "../utils/validateInput";

describe("Form Input Validation", () => {
  it("validates the tool name input", () => {
    const result = validateInput({
      toolName: "ChatGPT",
      planType: "Plus",
      monthlySpend: 20,
      teamSize: 1,
      primaryUseCase: "mixed",
    });
    expect(result.valid).toBe(true);
  });

  it("invalidates an incorrect tool name", () => {
    // Invalid tool name -- used any because it needs to return invalid and there needs to be some kind of type assigned in ts
    const result = validateInput({
      toolName: "UnknownTool" as any,
      planType: "Plus",
      monthlySpend: 20,
      teamSize: 1,
      primaryUseCase: "mixed",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toBe("Invalid tool name");
  });

  it("invalidates an incorrect plan type for a valid tool", () => {
    const result = validateInput({
      toolName: "ChatGPT",
      planType: "Hobby" as any, // Hobby is not a valid plan for ChatGPT
      monthlySpend: 20,
      teamSize: 1,
      primaryUseCase: "mixed",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toBe("Invalid plan type for the selected tool");
  });

  it("invalidates negative monthly spend", () => {
    const result = validateInput({
      toolName: "ChatGPT",
      planType: "Plus",
      monthlySpend: -10,
      teamSize: 1,
      primaryUseCase: "mixed",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toBe("Monthly spend must be a non-negative number");
  });

  it("invalidates zero or negative team size", () => {
    const result = validateInput({
      toolName: "ChatGPT",
      planType: "Plus",
      monthlySpend: 20,
      teamSize: 0,
      primaryUseCase: "mixed",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toBe("Team size must be a positive number");
  });

  it("invalidates an incorrect primary use case", () => {
    const result = validateInput({
      toolName: "ChatGPT",
      planType: "Plus",
      monthlySpend: 20,
      teamSize: 1,
      primaryUseCase: "unknown" as any,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toBe("Invalid primary use case");
  });

  it("invalidates empty monthly spend", () => {
    const result = validateInput({
      toolName: "ChatGPT",
      planType: "Plus",
      monthlySpend: "",
      teamSize: 1,
      primaryUseCase: "mixed",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toBe("Monthly spend must be a non-negative number");
  });

  it("invalidates empty team size", () => {
    const result = validateInput({
      toolName: "ChatGPT",
      planType: "Plus",
      monthlySpend: 20,
      teamSize: "",
      primaryUseCase: "mixed",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toBe("Team size must be a positive number");
  });

  it("invalidates empty primary use case", () => {
    const result = validateInput({
      toolName: "ChatGPT",
      planType: "Plus",
      monthlySpend: 20,
      teamSize: 1,
      primaryUseCase: "",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toBe("Invalid primary use case");
  });

  it("validates zero monthly spend", () => {
    const result = validateInput({
      toolName: "ChatGPT",
      planType: "Plus",
      monthlySpend: 0, // 0 is valid, not negative
      teamSize: 1,
      primaryUseCase: "mixed",
    });
    expect(result.valid).toBe(true);
    
  });
});
