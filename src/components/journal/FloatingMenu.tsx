import { Editor, FloatingMenu } from "@tiptap/react";
import { Button } from "antd";

const FloatingMenuComponent = ({ editor }: { editor: Editor }) => {
  return (
    <FloatingMenu
      editor={editor}
      tippyOptions={{
        duration: 100,
        offset: [0, 40],
      }}
    >
      <Button.Group>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
          size="small"
        >
          h1
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
          size="small"
        >
          h2
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
          size="small"
        >
          bullet list
        </Button>
        {/* quote */}
        <Button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
          size="small"
        >
          quote
        </Button>
      </Button.Group>
    </FloatingMenu>
  );
};

export default FloatingMenuComponent;
