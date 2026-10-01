"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { STORAGE_ERROR_MESSAGES } from "../constants";
import { deleteStoredImage } from "../actions";
import { storageApi } from "../api";
import type { PendingImage, RemovedImageOrigin, StorageTarget, StoredImage } from "../types";
import { validateImageFile } from "../utils/validate-image";

export type ImageUploadOptions = StorageTarget & {
  value: StoredImage[];
  onChange: (images: StoredImage[]) => void;
  maxCount: number;
  accept: string;
  maxSize: number;
  /**
   * Called after an image leaves `value`. "session" images were uploaded by
   * this component and their object is already deleted; "existing" ones came
   * from the parent and are left in Storage for the parent to deal with.
   */
  onRemove?: (image: StoredImage, origin: RemovedImageOrigin) => void;
};

/** Files refused before upload, and failed cleanups, shown under the dropzone. */
export type ImageUploadNotice = { key: string; message: string; fileName: string | null };

function deleteQuietly(image: StoredImage) {
  return deleteStoredImage({ bucket: image.bucket, path: image.path }).catch(() => ({ ok: false as const }));
}

/**
 * Upload lifecycle for ImageUpload: validate -> local preview -> upload ->
 * append to `value`. Each file uploads on its own, so one failure never
 * touches the others, and finished uploads are appended to the latest value
 * (not the one captured when they started) so parallel uploads never drop
 * each other.
 */
export function useImageUpload({ bucket, path, value, onChange, maxCount, accept, maxSize, onRemove }: ImageUploadOptions) {
  const [pending, setPending] = useState<PendingImage[]>([]);
  const [notices, setNotices] = useState<ImageUploadNotice[]>([]);

  // Latest value/pending, read by upload callbacks that resolve after later renders.
  const valueRef = useRef(value);
  const pendingRef = useRef(pending);
  // Keys still on screen; an upload that resolves for a key not in here was removed meanwhile.
  const liveKeys = useRef(new Set<string>());
  // Ids uploaded by this component, which it may delete again; the rest belong to the parent.
  const sessionIds = useRef(new Set<string>());

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const commitValue = useCallback(
    (next: StoredImage[]) => {
      valueRef.current = next;
      onChange(next);
    },
    [onChange],
  );

  const updatePending = useCallback((update: (items: PendingImage[]) => PendingImage[]) => {
    pendingRef.current = update(pendingRef.current);
    setPending(pendingRef.current);
  }, []);

  const forget = useCallback(
    (key: string) => {
      const item = pendingRef.current.find((entry) => entry.key === key);
      if (item) URL.revokeObjectURL(item.previewUrl);
      liveKeys.current.delete(key);
      updatePending((items) => items.filter((entry) => entry.key !== key));
    },
    [updatePending],
  );

  const upload = useCallback(
    async (item: PendingImage) => {
      try {
        const image = await storageApi.uploadImage(item.file, { bucket, path });
        // Removed (or unmounted) while uploading: drop the object we just created.
        if (!liveKeys.current.has(item.key)) {
          void deleteQuietly(image);
          return;
        }
        sessionIds.current.add(image.id);
        forget(item.key);
        commitValue([...valueRef.current, image]);
      } catch (error) {
        if (!liveKeys.current.has(item.key)) return;
        const message = error instanceof Error ? error.message : STORAGE_ERROR_MESSAGES.uploadFailed;
        updatePending((items) =>
          items.map((entry) => (entry.key === item.key ? { ...entry, status: "error", error: message } : entry)),
        );
      }
    },
    [bucket, path, commitValue, forget, updatePending],
  );

  const remainingSlots = Math.max(0, maxCount - value.length - pending.length);

  const addFiles = useCallback(
    (files: File[]) => {
      const nextNotices: ImageUploadNotice[] = [];
      const valid = files.filter((file) => {
        const message = validateImageFile(file, { accept, maxSize });
        if (message) nextNotices.push({ key: crypto.randomUUID(), message, fileName: file.name });
        return message === null;
      });

      const slots = Math.max(0, maxCount - valueRef.current.length - pendingRef.current.length);
      if (valid.length > slots) {
        nextNotices.push({ key: crypto.randomUUID(), message: STORAGE_ERROR_MESSAGES.tooMany(maxCount), fileName: null });
      }
      setNotices(nextNotices);

      const items = valid.slice(0, slots).map(
        (file): PendingImage => ({
          key: crypto.randomUUID(),
          file,
          previewUrl: URL.createObjectURL(file),
          status: "uploading",
          error: null,
        }),
      );
      for (const item of items) liveKeys.current.add(item.key);
      updatePending((current) => [...current, ...items]);
      for (const item of items) void upload(item);
    },
    [accept, maxSize, maxCount, updatePending, upload],
  );

  const retry = useCallback(
    (key: string) => {
      const item = pendingRef.current.find((entry) => entry.key === key);
      if (!item) return;
      const next: PendingImage = { ...item, status: "uploading", error: null };
      updatePending((items) => items.map((entry) => (entry.key === key ? next : entry)));
      void upload(next);
    },
    [updatePending, upload],
  );

  const removeImage = useCallback(
    async (image: StoredImage) => {
      commitValue(valueRef.current.filter((entry) => entry.id !== image.id));
      const fromSession = sessionIds.current.delete(image.id);
      if (fromSession) {
        const result = await deleteQuietly(image);
        if (!result.ok) {
          setNotices((current) => [
            ...current,
            { key: crypto.randomUUID(), message: STORAGE_ERROR_MESSAGES.deleteFailed, fileName: image.name },
          ]);
        }
      }
      onRemove?.(image, fromSession ? "session" : "existing");
    },
    [commitValue, onRemove],
  );

  const dismissNotice = useCallback((key: string) => {
    setNotices((current) => current.filter((notice) => notice.key !== key));
  }, []);

  // On unmount, free previews and orphan in-flight uploads so they clean up after themselves.
  useEffect(() => {
    const keys = liveKeys.current;
    return () => {
      for (const item of pendingRef.current) URL.revokeObjectURL(item.previewUrl);
      keys.clear();
    };
  }, []);

  return {
    pending,
    notices,
    remainingSlots,
    isUploading: pending.some((item) => item.status === "uploading"),
    addFiles,
    retry,
    removePending: forget,
    removeImage,
    dismissNotice,
  };
}
