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
    <div className="p-6">
      <form
        // onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-sm"
      >
        <select
          name="toolName"
          value={formData.toolName}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setFormData((prev) => ({
              ...prev,
              toolName: e.target.value,
              planType: "",
            }));
          }}
          className="border p-2 rounded"
          required
        >
          <option value="" disabled>
            Select a tool
          </option>
          {toolNames.map((tool) => {
            return (
              <option key={tool} value={tool}>
                {tool}
              </option>
            );
          })}
        </select>

        {formData.toolName && (
          <select
            name="planType"
            value={formData.planType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setFormData((prev) => ({
                ...prev,
                planType: e.target.value,
                monthlySpend: 0,
                teamSize: 0,
                primaryUseCase: "",
              }));
            }}
            className="border p-2 rounded"
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
              name="monthlySpend"
              value={formData.monthlySpend}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prev) => ({
                  ...prev,
                  monthlySpend: e.target.value === "" ? "" : Number(e.target.value),
                }));
              }}
              required
              className="border p-2 rounded"
              placeholder="Monthly Spend"
            />
            <input
              type="number"
              name="teamSize"
              value={formData.teamSize}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prev) => ({
                  ...prev,
                  teamSize: e.target.value === "" ? "" : Number(e.target.value),
                }));
              }}
              required
              className="border p-2 rounded"
              placeholder="Team Size"
            />
            <select
              name="primaryUseCase"
              value={formData.primaryUseCase}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setFormData((prev) => ({
                  ...prev,
                  primaryUseCase: e.target.value,
                }));
              }}
              className="border p-2 rounded"
              required
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
        {/* For each tool: which plan, current monthly spend, number of seats. Plus team size and
primary use case (coding / writing / data / research / mixed). Form state must persist
across page reloads. */}

        <button type="submit" className="bg-black text-white p-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
