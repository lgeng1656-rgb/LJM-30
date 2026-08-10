import { beforeEach, describe, expect, it } from "vitest";
import { loadProgress, saveProgress } from "./storage";

describe("birthday memory progress", () => {
  beforeEach(() => localStorage.clear());

  it("round-trips collected memory ids", () => {
    saveProgress(new Set(["01", "03"]));

    expect([...loadProgress()]).toEqual(["01", "03"]);
  });

  it("returns an empty set when saved data is malformed", () => {
    localStorage.setItem("lijinman-birthday-progress", "{broken");

    expect([...loadProgress()]).toEqual([]);
  });

  it("drops values that are not memory ids", () => {
    localStorage.setItem(
      "lijinman-birthday-progress",
      JSON.stringify(["02", 3, null, "09"]),
    );

    expect([...loadProgress()]).toEqual(["02", "09"]);
  });
});
