import React, { useState, useRef, useEffect, useCallback } from 'react';
import FireworkCanvas, { FireworkCanvasRef } from './components/FireworkCanvas';
import ControlPanel from './components/ControlPanel';
import AIDesigner from './components/AIDesigner';
import { PRESETS } from './constants';
import { FireworkConfig } from './types';

const App: React.FC = () => {
  const canvasRef = useRef<FireworkCanvasRef>(null);
  const [isAutoFiring, setIsAutoFiring] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  
  const handleLaunch = useCallback((config: FireworkConfig, target?: { x: number, y: number }) => {
    canvasRef.current?.launch(config, target);
  }, []);

  const handleToggleAutoFire = () => {
    setIsAutoFiring(prev => !prev);
  };

  const handleCanvasClick = (x: number, y: number) => {
    // Pick a random preset for mouse clicks
    const randomPreset = PRESETS[Math.floor(Math.random() * PRESETS.length)];
    
    // Add some random variation
    const variedConfig: FireworkConfig = {
        ...randomPreset.config,
        colors: Math.random() > 0.5 ? randomPreset.config.colors : [
          // Randomize colors occasionally for variety
          `hsl(${Math.random() * 360}, 100%, 60%)`,
          `hsl(${Math.random() * 360}, 100%, 60%)`, 
          '#ffffff'
        ],
        physics: {
            ...randomPreset.config.physics,
            initialVelocity: randomPreset.config.physics.initialVelocity * (0.8 + Math.random() * 0.4)
        },
        // Occasionally swap shape for clicking
        shape: Math.random() > 0.8 ? 'star' : randomPreset.config.shape
    };
    
    handleLaunch(variedConfig, { x, y });
  };

  useEffect(() => {
    let interval: number | undefined;

    if (isAutoFiring) {
      interval = window.setInterval(() => {
        const randomPreset = PRESETS[Math.floor(Math.random() * PRESETS.length)];
        
        const variedConfig: FireworkConfig = {
            ...randomPreset.config,
            physics: {
                ...randomPreset.config.physics,
                initialVelocity: randomPreset.config.physics.initialVelocity * (0.9 + Math.random() * 0.2)
            }
        };

        handleLaunch(variedConfig);
      }, 600 + Math.random() * 800); // Slightly faster auto fire
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoFiring, handleLaunch]);

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
      {/* Background Gradient for Sky */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black z-[-1]" />

      <FireworkCanvas 
        ref={canvasRef} 
        onClick={handleCanvasClick}
      />

      <ControlPanel 
        presets={PRESETS}
        onLaunch={handleLaunch}
        isAutoFiring={isAutoFiring}
        onToggleAutoFire={handleToggleAutoFire}
        onOpenAI={() => setIsAIModalOpen(true)}
      />

      <AIDesigner 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)}
        onLaunchGenerated={(config) => {
          handleLaunch(config);
        }}
      />
      
      {/* Footer / Credits */}
      <div className="fixed bottom-4 right-4 text-slate-600 text-xs pointer-events-none select-none">
        Powered by Gemini AI • Canvas & React
      </div>
    </div>
  );
};

export default App;