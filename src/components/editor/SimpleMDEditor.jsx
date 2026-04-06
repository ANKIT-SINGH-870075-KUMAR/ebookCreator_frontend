import { useState, useRef } from "react";
import { Type } from "lucide-react";
import MDEditor, { commands } from "@uiw/react-md-editor";

const SimpleMDEditor = ({
  value,
  onChange,
  options,
  onTextSelect
}) => {
  const editorRef = useRef(null);
  const [lastSelection, setLastSelection] = useState(null);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText && editorRef.current) {
      const textContent = value;
      const selectionStart = selection.baseOffset;
      const selectionEnd = selection.extentOffset;
      
      const textBeforeSelection = textContent.substring(0, selectionStart);
      const lines = textBeforeSelection.split('\n');
      const lineNumber = lines.length - 1;
      const position = lines[lines.length - 1].length;
      
      let type = 'text';
      if (selectedText.includes(' ') || selectedText.length > 20) {
        type = 'text';
      } else if (selectedText.split(/\s+/).length === 1) {
        type = 'word';
      }

      const selectionInfo = {
        text: selectedText,
        line: lineNumber,
        position: position,
        type: type,
        start: selectionStart,
        end: selectionEnd
      };
      
      setLastSelection(selectionInfo);
      if (onTextSelect) {
        onTextSelect(selectedText, selectionInfo);
      }
    }
  };

  return (
<div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
data-color-mode="light"
ref={editorRef}
onMouseUp={handleMouseUp}
>
{/* Header */}
<div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
  <div className="flex items-center gap-2 text-sm text-gray-600">
    <Type className="w-4 h-4"/>
    <span>Markdown Editor</span>
  </div>
</div>

{/* Editor */}
<div className="p-0">
  <MDEditor
    value={value}
    onChange={onChange}
    height={400}
    preview="live"
    commands={[
      commands.bold,
      commands.italic,
      commands.strikethrough,
      commands.hr,
      commands.title,
      commands.divider,
      commands.link,
      commands.code,
      commands.image,
      commands.unorderedListCommand,
      commands.orderedListCommand,
      commands.checkedListCommand
    ]}
    hideMenu={true}
  />
</div>
</div>
  )
}

export default SimpleMDEditor;