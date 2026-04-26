import { useEffect, useMemo, useRef } from "react";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, ListItemNode, ListNode, REMOVE_LIST_COMMAND } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { FORMAT_TEXT_COMMAND, REDO_COMMAND, UNDO_COMMAND } from "lexical";
import { EMPTY_EDITOR_STATE_JSON } from "../model/editor-state";

type LexicalEditorFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

const EDITOR_NAMESPACE = "post-editor";

export function LexicalEditorField({ value, onChange }: LexicalEditorFieldProps) {
  const normalizedValue = normalizeEditorState(value);

  const initialConfig = useMemo<InitialConfigType>(
    () => ({
      namespace: EDITOR_NAMESPACE,
      editable: true,
      theme: {
        paragraph: "mb-4",
        quote: "border-l-4 border-primary/30 pl-4 italic text-muted-foreground"
      },
      editorState: normalizedValue,
      nodes: [HeadingNode, QuoteNode, LinkNode, ListNode, ListItemNode],
      onError(error) {
        throw error;
      }
    }),
    [normalizedValue]
  );

  return (
    <div className="overflow-hidden rounded-xl border border-input bg-background">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={<ContentEditable className="min-h-[18rem] px-4 py-4 text-sm outline-none" />}
          placeholder={<div className="pointer-events-none px-4 py-4 text-sm text-muted-foreground">Write your post...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <LinkPlugin />
        <ListPlugin />
        <EditorStateSyncPlugin value={normalizedValue} />
        <OnChangePlugin
          ignoreSelectionChange
          onChange={(editorState) => {
            onChange(JSON.stringify(editorState.toJSON()));
          }}
        />
      </LexicalComposer>
    </div>
  );
}

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="flex flex-wrap gap-2 border-b border-border bg-muted/30 p-3">
      <ToolbarButton label="Undo" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} />
      <ToolbarButton label="Redo" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} />
      <ToolbarButton label="Bold" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")} />
      <ToolbarButton label="Italic" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")} />
      <ToolbarButton label="Underline" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")} />
      <ToolbarButton label="Bullet List" onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} />
      <ToolbarButton label="Numbered List" onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} />
      <ToolbarButton label="Clear List" onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)} />
      <ToolbarButton
        label="Link"
        onClick={() => {
          const url = window.prompt("Enter link URL", "https://");
          if (url === null) {
            return;
          }

          editor.dispatchCommand(TOGGLE_LINK_COMMAND, url.trim() || null);
        }}
      />
    </div>
  );
}

function ToolbarButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function EditorStateSyncPlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();
  const lastSerializedValueRef = useRef(value);

  useEffect(() => {
    if (value === lastSerializedValueRef.current) {
      return;
    }

    const currentSerializedValue = JSON.stringify(editor.getEditorState().toJSON());
    if (currentSerializedValue === value) {
      lastSerializedValueRef.current = value;
      return;
    }

    try {
      editor.setEditorState(editor.parseEditorState(value));
      lastSerializedValueRef.current = value;
    } catch {
      editor.setEditorState(editor.parseEditorState(EMPTY_EDITOR_STATE_JSON));
      lastSerializedValueRef.current = EMPTY_EDITOR_STATE_JSON;
    }
  }, [editor, value]);

  return null;
}

function normalizeEditorState(value: string | null | undefined) {
  const normalizedValue = value?.trim();
  return normalizedValue ? normalizedValue : EMPTY_EDITOR_STATE_JSON;
}
