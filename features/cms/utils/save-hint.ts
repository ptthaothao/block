import { IDLE_SAVE_HINTS, SAVE_STATE_LABELS } from "../constants";
import type { SaveState } from "../types";

/** The line under the markdown editor: the save state, or what will happen before the first save. */
export function saveHint(saveState: SaveState, { saved, canEdit }: { saved: boolean; canEdit: boolean }): string {
  if (!canEdit) return IDLE_SAVE_HINTS.readOnly;
  if (saveState !== "idle") return SAVE_STATE_LABELS[saveState];
  return saved ? IDLE_SAVE_HINTS.autosave : IDLE_SAVE_HINTS.unsaved;
}
