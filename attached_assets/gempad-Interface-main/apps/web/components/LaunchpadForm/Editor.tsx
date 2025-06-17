import React from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
// import Quill from "quill";

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    const DynamicComponent = ({ forwardedRef, ...props }: any) => (
      <RQ ref={forwardedRef} {...props} />
    );
    DynamicComponent.displayName = "ReactQuill";
    return DynamicComponent;
  },
  { ssr: false }
);

// Manually register video module
// Quill.register("formats/video", Quill.import("formats/video"));

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  bond?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange, bond }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }], // Header options
      ["bold", "italic", "underline", "strike"], // Text formatting
      [{ list: "ordered" }, { list: "bullet" }], // Lists
      [{ script: "sub" }, { script: "super" }], // Sub/superscript
      [{ indent: "-1" }, { indent: "+1" }], // Indentation
      [{ direction: "rtl" }], // Text direction
      [{ color: [] }, { background: [] }], // Color picker
      [{ align: [] }], // Alignment
      ["link", "image", "video"], // Media tools
      ["clean"], // Remove formatting
    ],
  };

  return (
    <div data-text-editor="name">
      <ReactQuill
        value={value}
        theme="snow"
        onChange={onChange}
        bounds={`[data-text-editor="name"]`}
        placeholder="Write something amazing..."
        modules={modules}
        formats={[
          "header",
          "bold",
          "italic",
          "underline",
          "strike",
          "list",
          "bullet",
          "script",
          "indent",
          "direction",
          "color",
          "background",
          "align",
          "link",
          "image",
          "video",
        ]}
      />
    </div>
  );
};

export default TextEditor;
