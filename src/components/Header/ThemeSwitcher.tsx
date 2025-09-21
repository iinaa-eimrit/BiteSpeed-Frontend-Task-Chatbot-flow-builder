import React from 'react';
import { useUiStore } from '../../state/useUiStore';

/** Compact theme preset switcher (top-left). */
const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useUiStore();

  return (
    <div
      className="
        fixed top-4 left-4 z-30
        flex items-center gap-2
        px-3 py-2 rounded-lg border border-gray-200 bg-white shadow-sm
      "
      aria-label="Design preset switcher"
    >
      <span className="text-sm text-gray-600">Design</span>
      <select
        className="px-2 py-1 text-sm border rounded-md bg-white"
        value={theme}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={(e) => setTheme(e.target.value as any)}
        aria-label="Select design preset"
      >
        <option value="light">Light</option>
        <option value="ghost">Ghost</option>
        <option value="teal">Teal</option>
      </select>
    </div>
  );
};

export default ThemeSwitcher;
