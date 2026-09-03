import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// The route persists via lib/db/supabase, which builds a real Supabase
// client at import time. These tests are about the route's own defensive
// input handling, not database integration, so the DB layer is mocked —
// this also avoids needing real Supabase env vars in the test environment.
const insertAuditWithTools = vi.fn();

vi.mock("@/lib/db/supabase", () => ({
  insertAuditWithTools: (...args: unknown[]) => insertAuditWithTools(...args),
}));

const { POST } = await import("@/app/api/audit/route");

function makeRequest(rawBody?: string) {
  return new NextRequest("http://localhost/api/audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: rawBody,
  });
}

// Shaped exactly like what the real client (SpendForm -> useAudit) sends:
// primaryUseCase lives once at the top level, never per-tool.
const validTool = {
  toolName: "ChatGPT",
  planType: "Plus",
  monthlySpend: 20,
  teamSize: 3,
};

describe("/api/audit defensive input handling", () => {
  beforeEach(() => {
    insertAuditWithTools.mockReset();
    insertAuditWithTools.mockResolvedValue("test-audit-id");
  });

  it("returns a controlled 400 on malformed JSON", async () => {
    const res = await POST(makeRequest("{not valid json"));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeTruthy();
  });

  it("returns a controlled 400 on a missing body", async () => {
    const res = await POST(makeRequest(undefined));
    expect(res.status).toBe(400);
  });

  it("returns a controlled 400 when tools is missing", async () => {
    const res = await POST(
      makeRequest(JSON.stringify({ primaryUseCase: "mixed" })),
    );
    expect(res.status).toBe(400);
  });

  it("returns a controlled 400 when tools is not an array", async () => {
    const res = await POST(
      makeRequest(JSON.stringify({ primaryUseCase: "mixed", tools: "nope" })),
    );
    expect(res.status).toBe(400);
  });

  it("returns a controlled 400 when a tool entry is malformed", async () => {
    const res = await POST(
      makeRequest(
        JSON.stringify({
          primaryUseCase: "mixed",
          tools: [{ toolName: "ChatGPT" }],
        }),
      ),
    );
    expect(res.status).toBe(400);
  });

  it("returns a controlled 400 when a tool entry isn't an object", async () => {
    const res = await POST(
      makeRequest(
        JSON.stringify({ primaryUseCase: "mixed", tools: ["not-an-object"] }),
      ),
    );
    expect(res.status).toBe(400);
  });

  it("returns a controlled 400 for an invalid use case", async () => {
    const res = await POST(
      makeRequest(
        JSON.stringify({
          primaryUseCase: "not-a-real-use-case",
          tools: [validTool],
        }),
      ),
    );
    expect(res.status).toBe(400);
  });

  it("returns a controlled 500 without leaking internals when persistence fails", async () => {
    insertAuditWithTools.mockRejectedValue(
      new Error("connection refused to db.internal:5432"),
    );
    const res = await POST(
      makeRequest(
        JSON.stringify({ primaryUseCase: "mixed", tools: [validTool] }),
      ),
    );
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(JSON.stringify(data)).not.toContain("db.internal");
  });

  it("succeeds for a valid request shaped exactly like the real client payload", async () => {
    const res = await POST(
      makeRequest(
        JSON.stringify({ primaryUseCase: "mixed", tools: [validTool] }),
      ),
    );
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.auditId).toBe("test-audit-id");
    expect(Array.isArray(data.tools)).toBe(true);
    expect(insertAuditWithTools).toHaveBeenCalledTimes(1);
  });
});
