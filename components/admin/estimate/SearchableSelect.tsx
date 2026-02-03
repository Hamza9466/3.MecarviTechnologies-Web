"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  label: string;
  placeholder: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function SearchableSelect({
  label,
  placeholder,
  value,
  options,
  onChange,
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  return (
    <div className="w-full relative" ref={rootRef}>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen((p) => !p);
        }}
        className={`w-full h-10 px-3 border rounded-md bg-white text-left flex items-center justify-between gap-3 ${
          disabled ? "bg-gray-100 text-gray-500 border-gray-200" : "border-gray-300 text-gray-900"
        }`}
      >
        <span className={`truncate ${value ? "text-gray-900" : "text-gray-400"}`}>
          {value || placeholder}
        </span>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 w-full border border-gray-300 rounded-md bg-white shadow-lg overflow-hidden z-50">
          <div className="p-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-10 px-3 border border-blue-500 rounded-md focus:outline-none"
              placeholder=""
              autoFocus
            />
          </div>

          <div className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">No results</div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    opt === value ? "text-purple-700 font-medium" : "text-gray-700"
                  }`}
                >
                  {opt}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
