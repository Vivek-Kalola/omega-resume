import { useEffect, useState, useRef } from 'react';
import { Bold, Italic, Underline } from 'lucide-react';

export const FormatToolbar = () => {
  const [position, setPosition] = useState({ top: 0, left: 0, show: false });
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setPosition(prev => ({ ...prev, show: false }));
        return;
      }
      
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Check if the selection is inside our DirectEdit fields
      let node = selection.anchorNode as Node | null;
      let isInsideDirectEdit = false;
      
      while (node) {
        if (node.nodeType === 1 && (node as Element).classList?.contains('direct-edit-field')) {
          isInsideDirectEdit = true;
          break;
        }
        node = node.parentNode;
      }

      if (!isInsideDirectEdit) {
         setPosition(prev => ({ ...prev, show: false }));
         return;
      }

      // Position above the selected text
      setPosition({
        top: rect.top - 45, // 45px above
        left: rect.left + rect.width / 2,
        show: true
      });
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    // Also listen to mouse up to handle cases where selection is made by double clicking
    document.addEventListener('mouseup', handleSelectionChange);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mouseup', handleSelectionChange);
    };
  }, []);

  const format = (command: string) => {
    document.execCommand(command, false, undefined);
  };

  if (!position.show) return null;

  return (
    <div 
      ref={toolbarRef}
      className="fixed z-[100] bg-zinc-800 text-white rounded-lg shadow-xl flex items-center p-1 transform -translate-x-1/2"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      onMouseDown={e => e.preventDefault()} // Prevent losing focus when clicking buttons
    >
      <button 
        onClick={() => format('bold')} 
        className="p-1.5 hover:bg-zinc-700 hover:text-[rgb(250,204,21)] rounded transition-colors"
        title="Bold (Cmd/Ctrl+B)"
      >
        <Bold size={16} />
      </button>
      <button 
        onClick={() => format('italic')} 
        className="p-1.5 hover:bg-zinc-700 hover:text-[rgb(250,204,21)] rounded transition-colors"
        title="Italic (Cmd/Ctrl+I)"
      >
        <Italic size={16} />
      </button>
      <button 
        onClick={() => format('underline')} 
        className="p-1.5 hover:bg-zinc-700 hover:text-[rgb(250,204,21)] rounded transition-colors"
        title="Underline (Cmd/Ctrl+U)"
      >
        <Underline size={16} />
      </button>
    </div>
  );
};
