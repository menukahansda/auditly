"use client";

import { useState } from "react";
import { ToolName } from "@/lib/audit/types";
import { PRIMARY_USE_CASES, TOOL_PLANS } from "@/lib/audit/constants";
type FormData = {
  toolName: string;
  planType: string;
  monthlySpend: number | "";
  teamSize: number | "";
  primaryUseCase: string;
};

export default function SpendForm() {
  const [formData, setFormData] = useState<FormData>({
    toolName: "",
    planType: "",
    monthlySpend: "",
    teamSize: "",
    primaryUseCase: "",
  });
  const toolNames = Object.keys(TOOL_PLANS) as ToolName[];

  // function handleSubmit(e : React.ChangeEvent<HTMLInputElement>) {
  //   e.preventDefault();
  // }
  return (
    <div className="min-h-screen flex justify-center items-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-lg p-8 rounded-2xl bg-[#111111] border border-neutral-800 shadow-[0_0_60px_rgba(255,255,255,0.15)]">
        <h1 className="text-2xl font-bold text-neutral-100 mb-6 text-center">
          AI Tool Spend Form
        </h1>

        <form className="flex flex-col gap-4">
          <select
            name="toolName"
            value={formData.toolName}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                toolName: e.target.value,
                planType: "",
              }));
            }}
            className="bg-[#1a1a1a] border border-neutral-700 text-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-500"
            required
          >
            <option value="" disabled>
              Select a tool
            </option>

            {toolNames.map((tool) => (
              <option key={tool} value={tool}>
                {tool}
              </option>
            ))}
          </select>

          {formData.toolName && (
            <select
              value={formData.planType}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  planType: e.target.value,
                  monthlySpend: 0,
                  teamSize: 0,
                  primaryUseCase: "",
                }));
              }}
              className="bg-[#1a1a1a] border border-neutral-700 text-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-500"
            >
              <option value="" disabled>
                Select a plan
              </option>

              {TOOL_PLANS[formData.toolName as ToolName]?.map((plan) => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </select>
          )}

          {formData.planType && (
            <div className="flex flex-col gap-4">
              <input
                type="number"
                placeholder="Monthly Spend"
                value={formData.monthlySpend}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    monthlySpend:
                      e.target.value === "" ? "" : Number(e.target.value),
                  }));
                }}
                className="bg-[#1a1a1a] border border-neutral-700 text-neutral-200 p-3 rounded-lg placeholder:text-neutral-500"
              />

              <input
                type="number"
                placeholder="Team Size"
                value={formData.teamSize}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    teamSize:
                      e.target.value === "" ? "" : Number(e.target.value),
                  }));
                }}
                className="bg-[#1a1a1a] border border-neutral-700 text-neutral-200 p-3 rounded-lg placeholder:text-neutral-500"
              />

              <select
                value={formData.primaryUseCase}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    primaryUseCase: e.target.value,
                  }));
                }}
                className="bg-[#1a1a1a] border border-neutral-700 text-neutral-200 p-3 rounded-lg"
              >
                <option value="" disabled>
                  Select primary use case
                </option>

                {PRIMARY_USE_CASES.map((useCase) => (
                  <option key={useCase} value={useCase}>
                    {useCase}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            className="bg-neutral-100 text-black font-semibold p-3 rounded-lg hover:opacity-90"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
