// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  LEGACY_QUICK_PUBLISH_STORAGE_KEYS,
  useQuickPublishDraft,
} from "@/components/vehicles/quick-publish/hooks/useQuickPublishDraft";

afterEach(() => {
  cleanup();
});

describe("useQuickPublishDraft", () => {
  it("removes form data stored by previous versions", () => {
    window.localStorage.setItem(
      LEGACY_QUICK_PUBLISH_STORAGE_KEYS.localStorage,
      "{}",
    );
    window.sessionStorage.setItem(
      LEGACY_QUICK_PUBLISH_STORAGE_KEYS.sessionStorage,
      "{}",
    );

    renderHook(() => useQuickPublishDraft({ enabled: true }));

    expect(
      window.localStorage.getItem(
        LEGACY_QUICK_PUBLISH_STORAGE_KEYS.localStorage,
      ),
    ).toBeNull();
    expect(
      window.sessionStorage.getItem(
        LEGACY_QUICK_PUBLISH_STORAGE_KEYS.sessionStorage,
      ),
    ).toBeNull();
  });

  it("is ready immediately and never restores a draft", () => {
    const { result } = renderHook(() =>
      useQuickPublishDraft({ enabled: true }),
    );

    expect(result.current.isDraftReady).toBe(true);
    expect(result.current.restoredFromDraft).toBe(false);
    expect(result.current.pendingPublish).toBe(false);
  });

  it("keeps the pending publish flag in memory only", () => {
    const { result } = renderHook(() =>
      useQuickPublishDraft({ enabled: true }),
    );

    act(() => result.current.setPendingPublish(true));
    expect(result.current.pendingPublish).toBe(true);
    expect(window.sessionStorage.length).toBe(0);
    expect(window.localStorage.length).toBe(0);

    act(() => result.current.discardDraft());
    expect(result.current.pendingPublish).toBe(false);
  });

  it("never reports a pending publish in edit mode", () => {
    const { result } = renderHook(() =>
      useQuickPublishDraft({ enabled: false }),
    );

    act(() => result.current.setPendingPublish(true));
    expect(result.current.pendingPublish).toBe(false);
  });
});
