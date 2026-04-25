import { useState, useRef } from 'react';
import { UploadCloud, Download, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { downloadBlob } from '../utils/api';

export default function BatchUploader({ onBatch, accept = '.csv', challenge, fileName = 'predictions.csv' }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [resultBlob, setResultBlob] = useState(null);
  const inputRef = useRef();

  const handleFile = (f) => {
    setFile(f);
    setDone(false);
    setResultBlob(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleRun = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await onBatch(file);
      setResultBlob(res.data);
      setDone(true);
      toast.success('Batch prediction complete!');
    } catch (e) {
      toast.error('Batch prediction failed. Check your file format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <p className="text-sm font-semibold text-slate-300 mb-2">Batch Predict</p>
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        className="border-2 border-dashed border-[#2D3748] hover:border-indigo-500/50
          rounded-xl p-5 text-center cursor-pointer transition-colors"
      >
        <UploadCloud className="mx-auto mb-2 text-slate-500" size={28}/>
        <p className="text-sm text-slate-400">
          {file ? file.name : `Drag & drop or click to upload (${accept})`}
        </p>
        <input ref={inputRef} type="file" accept={accept} className="hidden"
          onChange={e => handleFile(e.target.files[0])}/>
      </div>

      {challenge === 1 && <p className="text-xs text-slate-600 mt-1">CSV must have a "text" column</p>}
      {challenge === 2 && <p className="text-xs text-slate-600 mt-1">CSV must have "title" and "text" columns</p>}
      {challenge === 3 && <p className="text-xs text-slate-600 mt-1">File must have a "text" column</p>}

      {file && !done && (
        <button onClick={handleRun} disabled={loading}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-indigo-600
            hover:bg-indigo-700 text-white rounded-xl py-2.5 text-sm font-semibold
            disabled:opacity-50 transition-colors">
          {loading ? <><Loader size={16} className="animate-spin"/> Running NLP Pipeline...</> : 'Run Batch Predict'}
        </button>
      )}

      {done && resultBlob && (
        <button onClick={() => downloadBlob(resultBlob, fileName)}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-green-600
            hover:bg-green-700 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors">
          <Download size={16}/> Download Results CSV
        </button>
      )}
    </div>
  );
}