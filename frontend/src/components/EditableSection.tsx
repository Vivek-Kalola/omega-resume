import React, { useState } from 'react';
import { MoveUp, MoveDown, Trash2, Plus } from 'lucide-react';

interface EditableSectionProps {
  children: React.ReactNode;
  isPreview?: boolean;
  showToolbar?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
}

export const EditableSection = ({
  children,
  isPreview,
  showToolbar,
  onMoveUp,
  onMoveDown,
  onDelete,
  onAdd
}: EditableSectionProps) => {
  const [isHovered, setIsHovered] = useState(false);

  if (isPreview) {
    return <div>{children}</div>;
  }

  return (
    <div 
      className="relative outline outline-2 outline-transparent hover:outline-[rgb(250,204,21)] rounded-sm group transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && showToolbar && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 z-50 pb-2 flex flex-col items-center">
          <div className="bg-zinc-800 text-white rounded-full px-4 py-1.5 flex items-center space-x-4 shadow-lg">
            {onAdd && (
              <button onClick={(e) => { e.stopPropagation(); onAdd(); }} className="hover:text-[rgb(250,204,21)] transition-colors" title="Add New">
                <Plus size={14} />
              </button>
            )}
            {onMoveUp && (
              <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} className="hover:text-[rgb(250,204,21)] transition-colors" title="Move Up">
                <MoveUp size={14} />
              </button>
            )}
            {onMoveDown && (
              <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} className="hover:text-[rgb(250,204,21)] transition-colors" title="Move Down">
                <MoveDown size={14} />
              </button>
            )}
            {onDelete && (
              <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="hover:text-red-400 transition-colors" title="Delete">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {children}
    </div>
  );
};
