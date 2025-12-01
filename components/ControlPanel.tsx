import React from 'react';
import { Preset, FireworkConfig } from '../types';
import { Play, Sparkles, Settings2, Rocket } from 'lucide-react';

interface ControlPanelProps {
  presets: Preset[];
  onLaunch: (config: FireworkConfig) => void;
  isAutoFiring: boolean;
  onToggleAutoFire: () => void;
  onOpenAI: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  presets,
  onLaunch,
  isAutoFiring,
  onToggleAutoFire,
  onOpenAI,
}) => {
  return (
    <div className="fixed left-4 top-4 bottom-4 w-64 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 flex flex-col gap-4 text-white z-10 shadow-2xl overflow-hidden transition-all hover:bg-slate-900/90">
      
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-slate-700/50">
        <Sparkles className="w-6 h-6 text-yellow-400" />
        <h1 className="font-bold text-xl tracking-wide bg-gradient-to-r from-yellow-400 to-purple-500 bg-clip-text text-transparent">
          LumiSky
        </h1>
      </div>

      {/* Main Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onOpenAI}
          className="group relative flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/25 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <Settings2 className="w-5 h-5" />
          <span className="font-semibold">AI Designer</span>
        </button>

        <button
          onClick={onToggleAutoFire}
          className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl border transition-all ${
            isAutoFiring
              ? 'bg-red-500/20 border-red-500/50 text-red-200 hover:bg-red-500/30'
              : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 hover:bg-emerald-500/30'
          }`}
        >
          {isAutoFiring ? (
            <>
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span>Stop Show</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Start Show</span>
            </>
          )}
        </button>
      </div>

      {/* Manual Launch Presets */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-2">
          Manual Launch
        </h3>
        
        <div className="grid grid-cols-1 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onLaunch(preset.config)}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-transparent hover:border-slate-600 transition-all text-left group"
            >
              <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                {preset.icon}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-200">
                  {preset.name}
                </span>
                <span className="text-xs text-slate-500">
                  {preset.config.shape} • {preset.config.particleCount} pts
                </span>
              </div>
              <Rocket className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 text-slate-400 transform translate-x-2 group-hover:translate-x-0 transition-all" />
            </button>
          ))}
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="pt-4 border-t border-slate-700/50 text-xs text-slate-500 text-center">
        🖱️ Click sky to launch fireworks!
        <br />
        ✨ Use AI for custom designs
      </div>
    </div>
  );
};

export default ControlPanel;