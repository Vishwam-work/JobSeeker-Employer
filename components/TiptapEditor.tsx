"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Editor } from "@tiptap/react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function TiptapEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false, // ✅ Fix SSR issue
    onUpdate: ({ editor }: { editor: Editor }) => {
      onChange(editor.getHTML());
    },
  });
 useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);
  if (!editor) return null;

  return (
    <div className="border rounded-lg p-3 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-3 border-b pb-2">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 text-sm rounded-md border transition ${
            editor.isActive("bold")
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          B
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 text-sm rounded-md border transition ${
            editor.isActive("italic")
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          I
        </button>

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 text-sm rounded-md border transition ${
            editor.isActive("bulletList")
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          • List
        </button>

        {/* Ordered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 text-sm rounded-md border transition ${
            editor.isActive("orderedList")
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          1. List
        </button>

        {/* Heading */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`px-3 py-1 text-sm rounded-md border transition ${
            editor.isActive("heading", { level: 1 })
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          H1
        </button>

      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
