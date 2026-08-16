import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
      ip: "127.0.0.1",
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("contact.submit", () => {
  it("rejects an underspecified brief before notifying the owner", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.contact.submit({ brief: "коротко" })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });
});
