import React, { useState } from 'react';
import { X, Wand2, Loader2, Info } from 'lucide-react';
import { generateFireworkConfig } from '../services/geminiService';
import { FireworkConfig } from '../types';

interface AIDesignerProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchGenerated: (config: FireworkConfig) => void;
}

const AIDesigner: React.FC<AIDesignerProps> = ({ isOpen, onClose, onLaunchGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const config = await generateFireworkConfig(prompt);
      onLaunchGenerated(config);
      // Optional: Don't close immediately so they can tweak? 
      // Let's close for better immersion after success.
      onClose();
      setPrompt('');
    } catch (err) {
      setError("Failed to generate firework. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">AI Pyrotechnician</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-slate-300 text-sm">
            Describe your dream firework. The AI will calculate the physics, colors, and explosion pattern to match your imagination.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A massive golden willow that slowly fades into embers, or a bright neon blue ring explosion..."
                className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                autoFocus
              />
            </div>

            {error && (
              <div className="text-red-400 text-xs flex items-center gap-1 bg-red-950/30 p-2 rounded">
                <Info className="w-3 h-3" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Synthesizing Physics...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Generate & Launch</span>
                </>
              )}
            </button>
          </form>
          
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs text-slate-500">Try:</span>
            {["Giant Red Heart", "Slow Golden Rain", "Cyberpunk Burst"].map(suggestion => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setPrompt(suggestion)}
                className="text-xs px-2 py-1 rounded-full bg-slate-800 text-indigo-300 hover:bg-slate-700 transition-colors border border-slate-700"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDesigner;
