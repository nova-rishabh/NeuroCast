import React, { useRef, useState } from 'react';
import { CloudUpload, Loader2, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BatchUploader({ onUpload, accept, isLoading, challenge }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (accept && !accept.includes(file.name.split('.').pop().toLowerCase()) && !accept.includes(file.type)) {
        toast.error(`Invalid file type. Accepted: ${accept}`);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className="card p-6 mt-6 border-brand-border">
      <h3 className="text-lg font-semibold mb-4 text-brand-navy">Batch Predict</h3>
      
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragActive ? 'border-brand-indigo bg-brand-indigo/5 scale-[1.02]' : 'border-slate-300 hover:border-brand-indigo hover:bg-slate-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <CloudUpload className={`mx-auto h-10 w-10 mb-2 transition-colors ${dragActive ? 'text-brand-indigo' : 'text-slate-400'}`} />
          <p className="text-sm text-brand-navy font-medium">Drag & drop or click to upload</p>
          <p className="text-xs text-brand-gray mt-1">Accepts {accept}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center">
          <p className="text-sm text-brand-indigo mb-4 font-mono break-all font-medium">{selectedFile.name}</p>
          
          {isLoading ? (
            <div className="flex items-center text-brand-indigo space-x-2">
              <Loader2 className="animate-spin h-5 w-5" />
              <span className="font-medium">Running NLP Pipeline...</span>
            </div>
          ) : (
            <div className="flex space-x-3 w-full">
              <button
                onClick={() => setSelectedFile(null)}
                className="flex-1 py-2 px-4 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="flex-1 py-2 px-4 rounded-lg bg-brand-indigo hover:bg-brand-navy transition-colors text-sm font-semibold flex items-center justify-center space-x-2 text-white shadow-sm"
              >
                <span>Run Batch</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
