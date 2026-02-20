'use client';

import { useState } from 'react';

interface ShortcutInstructionsProps {
  apiUrl: string;
}

export default function ShortcutInstructions({ apiUrl }: ShortcutInstructionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-800/80 rounded-xl border border-zinc-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">📱</span>
          <div>
            <h3 className="font-semibold text-white">iOS Shortcut Setup</h3>
            <p className="text-sm text-zinc-400">Automate daily wallpaper updates</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          {/* API URL */}
          <div className="bg-zinc-900 rounded-lg p-3">
            <p className="text-xs text-zinc-400 mb-2">Your personalized API URL:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs text-emerald-400 break-all">
                {apiUrl || 'Configure your wallpaper to generate URL'}
              </code>
              <button
                onClick={handleCopy}
                disabled={!apiUrl}
                className="shrink-0 px-3 py-1 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-sm rounded transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Required setting */}
          <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
            <p className="text-sm text-red-200">
              <strong>Required for full automation:</strong> In <strong>Set Wallpaper</strong>, turn <strong>Show Preview</strong> off.
            </p>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <h4 className="font-medium text-white">Setup Instructions:</h4>
            <ol className="space-y-3 text-sm text-zinc-300">
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span>
                  Open the <strong>Shortcuts</strong> app on your iPhone
                </span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span>
                  Tap <strong>+</strong> to create a new shortcut
                </span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <span>
                  Add <strong>URL</strong> action and paste your API URL
                </span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <span>
                  Add <strong>Get Contents of URL</strong> action
                </span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold">
                  5
                </span>
                <span>
                  Add <strong>Set Wallpaper</strong> action (choose Lock Screen, Home Screen, or Both) and turn <strong>Show Preview</strong> off
                </span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold">
                  6
                </span>
                <span>
                  Name your shortcut (e.g., &quot;Update Year Progress&quot;) and run it once to grant permissions
                </span>
              </li>
            </ol>
          </div>

          {/* Automation */}
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700">
            <h4 className="font-medium text-white mb-2">🔄 Daily Automation (Optional):</h4>
            <ol className="space-y-2 text-sm text-zinc-300">
              <li>1. Go to <strong>Automation</strong> tab in Shortcuts</li>
              <li>2. Tap <strong>+</strong> → <strong>Time of Day</strong></li>
              <li>3. Set time (e.g., 6:00 AM)</li>
              <li>4. Add <strong>Run Shortcut</strong> and select your wallpaper shortcut</li>
              <li>5. Choose <strong>Run Immediately</strong> and turn off <strong>Ask Before Running</strong></li>
            </ol>
          </div>

          {/* Pro tip */}
          <div className="bg-emerald-900/20 border border-emerald-700/50 rounded-lg p-3">
            <p className="text-sm text-emerald-200">
              <strong>Pro tip:</strong> With <strong>Set Wallpaper</strong> + <strong>Show Preview off</strong>, the wallpaper applies automatically when the shortcut runs, with no manual save needed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
