"use client";

import { useRef, useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, className = "" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value || undefined);
    editorRef.current?.focus();
    handleInput();
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      execCommand("insertImage", url);
    }
  };

  const insertVideo = () => {
    const url = prompt("Enter video URL:");
    if (url && editorRef.current) {
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      const videoHtml = `<iframe src="${url}" frameborder="0" allowfullscreen style="width: 100%; height: 400px;"></iframe>`;
      const div = document.createElement("div");
      div.innerHTML = videoHtml;
      range?.insertNode(div);
      editorRef.current.focus();
      handleInput();
    }
  };

  return (
    <div className={`border border-gray-300 rounded-lg bg-white ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-300 p-2 flex items-center gap-2 flex-wrap bg-gray-50">
        {/* Font Family */}
        <select
          onChange={(e) => execCommand("fontName", e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
          defaultValue="Sans Serif"
        >
          <option value="Sans Serif">Sans Serif</option>
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
        </select>

        {/* Font Size/Style */}
        <select
          onChange={(e) => {
            if (e.target.value === "heading1") {
              execCommand("formatBlock", "<h1>");
            } else if (e.target.value === "heading2") {
              execCommand("formatBlock", "<h2>");
            } else if (e.target.value === "heading3") {
              execCommand("formatBlock", "<h3>");
            } else {
              execCommand("formatBlock", "<p>");
            }
          }}
          className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
          defaultValue="Normal"
        >
          <option value="Normal">Normal</option>
          <option value="heading1">Heading 1</option>
          <option value="heading2">Heading 2</option>
          <option value="heading3">Heading 3</option>
        </select>

        {/* Bold */}
        <button
          type="button"
          onClick={() => execCommand("bold")}
          className="px-2 py-1 hover:bg-gray-200 rounded text-black"
          title="Bold"
        >
          <span className="font-bold text-black">B</span>
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => execCommand("italic")}
          className="px-2 py-1 hover:bg-gray-200 rounded text-black"
          title="Italic"
        >
          <span className="italic text-black">I</span>
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => execCommand("underline")}
          className="px-2 py-1 hover:bg-gray-200 rounded text-black"
          title="Underline"
        >
          <span className="underline text-black">U</span>
        </button>

        {/* Strikethrough */}
        <button
          type="button"
          onClick={() => execCommand("strikeThrough")}
          className="px-2 py-1 hover:bg-gray-200 rounded text-black"
          title="Strikethrough"
        >
          <span className="line-through text-black">S</span>
        </button>

        {/* Quote */}
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "<blockquote>")}
          className="px-2 py-1 hover:bg-gray-200 rounded text-lg text-black"
          title="Quote"
        >
          "
        </button>

        {/* Code */}
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "<pre>")}
          className="px-2 py-1 hover:bg-gray-200 rounded text-sm font-mono text-black"
          title="Code"
        >
          &lt;/&gt;
        </button>

        {/* Numbered List */}
        <button
          type="button"
          onClick={() => execCommand("insertOrderedList")}
          className="px-2 py-1 hover:bg-gray-200 rounded text-black"
          title="Numbered List"
        >
          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        </button>

        {/* Bulleted List */}
        <button
          type="button"
          onClick={() => execCommand("insertUnorderedList")}
          className="px-2 py-1 hover:bg-gray-200 rounded text-black"
          title="Bulleted List"
        >
          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Align Left */}
        <button
          type="button"
          onClick={() => execCommand("justifyLeft")}
          className="px-2 py-1 hover:bg-gray-200 rounded text-black"
          title="Align Left"
        >
          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M3 18h18M3 6h18" />
          </svg>
        </button>

        {/* Align Center */}
        <button
          type="button"
          onClick={() => execCommand("justifyCenter")}
          className="px-2 py-1 hover:bg-gray-200 rounded text-black"
          title="Align Center"
        >
          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Align Right */}
        <button
          type="button"
          onClick={() => execCommand("justifyRight")}
          className="px-2 py-1 hover:bg-gray-200 rounded text-black"
          title="Align Right"
        >
          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-18M21 14h-18M21 18h-18M21 6h-18" />
          </svg>
        </button>

        {/* Link */}
        <button
          type="button"
          onClick={insertLink}
          className="px-2 py-1 hover:bg-gray-200 rounded text-black"
          title="Insert Link"
        >
          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>

        {/* Image */}
        <button
          type="button"
          onClick={insertImage}
          className="px-2 py-1 hover:bg-gray-200 rounded text-black"
          title="Insert Image"
        >
          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        {/* Video */}
        <button
          type="button"
          onClick={insertVideo}
          className="px-2 py-1 hover:bg-gray-200 rounded text-black"
          title="Insert Video"
        >
          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[200px] p-4 focus:outline-none text-gray-900"
        style={{ whiteSpace: "pre-wrap" }}
        data-placeholder={placeholder || "Enter description..."}
      />
      <style jsx>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

