// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSettings } from "./useSettings";
import { useSettingsContext } from "./useSettingsContext";
import { SettingsProvider } from "./SettingsProvider";
import { defaultSettings } from "./settings";

beforeEach(() => {
  localStorage.clear();
});

function saved() {
  return JSON.parse(localStorage.getItem("settings") ?? "null");
}

describe("useSettings", () => {
  it("uses the defaults when nothing is saved", () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current.settings).toEqual(defaultSettings);
  });

  it("loads saved settings and fills in missing ones from the defaults", () => {
    localStorage.setItem("settings", JSON.stringify({ soundOn: false }));

    const { result } = renderHook(() => useSettings());

    expect(result.current.settings).toEqual({
      ...defaultSettings,
      soundOn: false,
    });
  });

  it("falls back to the defaults when the saved value is broken", () => {
    localStorage.setItem("settings", "{not json");

    const { result } = renderHook(() => useSettings());

    expect(result.current.settings).toEqual(defaultSettings);
  });

  it("toggles one setting and leaves the others alone", () => {
    const { result } = renderHook(() => useSettings());

    act(() => result.current.toggleSetting("musicOn"));

    expect(result.current.settings).toEqual({
      ...defaultSettings,
      musicOn: !defaultSettings.musicOn,
    });
  });

  it("saves changes so they survive a reload", () => {
    const { result } = renderHook(() => useSettings());

    act(() => result.current.toggleSetting("soundOn"));

    expect(saved().soundOn).toBe(!defaultSettings.soundOn);
  });
});

describe("useSettingsContext", () => {
  it("gives access to the settings inside the provider", () => {
    const { result } = renderHook(() => useSettingsContext(), {
      wrapper: SettingsProvider,
    });

    expect(result.current.settings).toEqual(defaultSettings);
  });

  it("throws a clear error outside the provider", () => {
    // React logs the thrown error; keep the test output clean.
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useSettingsContext())).toThrow(
      /inside Settings Provider/,
    );
  });
});
