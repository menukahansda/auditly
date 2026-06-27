import type { ToolFormData } from "@/lib/audit/types";

type Props = {
  tools: ToolFormData[];
  onRemove: (index: number) => void;
};

export default function AddedTools({ tools, onRemove }: Props) {
  return (
    <div className="w-64 p-6 rounded-2xl bg-[#111111] border border-neutral-800 self-start">
      <h2 className="text-neutral-100 font-semibold text-lg mb-4">Added Tools</h2>
      <ul className="flex flex-col gap-3">
        {tools.map((tool, i) => (
          <li
            key={i}
            className="flex items-start justify-between gap-2 p-3 rounded-lg bg-[#1a1a1a] border border-neutral-700"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-neutral-100 text-sm font-medium">{tool.toolName}</span>
              <span className="text-neutral-400 text-xs">{tool.planType}</span>
              <span className="text-neutral-500 text-xs">${tool.monthlySpend}/mo · {tool.teamSize} users</span>
            </div>
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="text-neutral-500 hover:text-red-400 text-xs mt-0.5 shrink-0"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}