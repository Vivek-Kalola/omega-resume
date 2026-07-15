import { useState } from 'react';

import { Download, Eye, ChevronLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResumeCanvas } from '../components/ResumeCanvas';
import { useResume } from '../context/ResumeContext';
import toast from 'react-hot-toast';

export const BuilderPage = () => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { saveResume, exportPDF, isLoading } = useResume();
  const [isSaving, setIsSaving] = useState(false);

  const handleExportPDF = () => {
    exportPDF();
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveResume();
      toast.success('Resume saved successfully!');
    } catch (e) {
      toast.error('Failed to save resume.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p>Loading your resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-800 relative font-sans print:bg-white print:m-0 print:p-0 flex flex-col items-center">
      
      {/* Floating Header */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-3 print:hidden">
        <Link to="/" className="flex items-center space-x-2 px-4 py-2 bg-zinc-800/80 text-gray-300 rounded-full hover:bg-zinc-700 transition backdrop-blur-md border border-zinc-700/50 text-sm font-medium mr-4">
          <ChevronLeft size={16} />
          <span>Home</span>
        </Link>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition backdrop-blur-md shadow-lg text-sm font-medium disabled:opacity-50"
        >
          <Save size={16} />
          <span>{isSaving ? 'Saving...' : 'Save'}</span>
        </button>

        <button 
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition backdrop-blur-md border text-sm font-medium
            ${isPreviewMode 
              ? 'bg-[rgb(250,204,21)] text-black border-[rgb(250,204,21)] hover:bg-yellow-500' 
              : 'bg-zinc-800/80 text-gray-300 border-zinc-700/50 hover:bg-zinc-700'}`}
        >
          <Eye size={16} />
          <span>{isPreviewMode ? 'Edit Mode' : 'Preview'}</span>
        </button>

        <button 
          onClick={handleExportPDF}
          className="flex items-center space-x-2 px-4 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition backdrop-blur-md shadow-lg text-sm font-medium"
        >
          <Download size={16} />
          <span>Export PDF</span>
        </button>
      </div>

      {/* Editor Workspace */}
      <div className="py-12 px-4 w-full flex justify-center print:py-0 print:px-0">
        {/* A4 Canvas */}
        <div className={`
          w-[210mm] min-h-[297mm] bg-white shadow-2xl relative
          print:w-auto print:min-h-0 print:shadow-none print:bg-white
          ${isPreviewMode ? 'pointer-events-none' : ''}
        `}>
          <ResumeCanvas isPreview={isPreviewMode} />
        </div>
      </div>
    </div>
  );
};
