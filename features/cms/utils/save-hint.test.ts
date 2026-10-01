import { describe, expect, it } from "vitest";

import { IDLE_SAVE_HINTS, SAVE_STATE_LABELS } from "../constants";
import { saveHint } from "./save-hint";

describe("saveHint", () => {
  it("tells read-only viewers they cannot edit", () => {
    expect(saveHint("dirty", { saved: true, canEdit: false })).toBe(IDLE_SAVE_HINTS.readOnly);
  });

  it("shows the save state once something happened", () => {
    expect(saveHint("saving", { saved: true, canEdit: true })).toBe(SAVE_STATE_LABELS.saving);
  });

  it("explains autosave before the first edit", () => {
    expect(saveHint("idle", { saved: false, canEdit: true })).toBe(IDLE_SAVE_HINTS.unsaved);
    expect(saveHint("idle", { saved: true, canEdit: true })).toBe(IDLE_SAVE_HINTS.autosave);
  });
});
