import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FireworkConfig, FireworkShape } from "../types";
import { DEFAULT_PHYSICS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fireworkSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    colors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Array of hex color strings (e.g., '#FF0000'). Choose colors that match the description.",
    },
    particleCount: {
      type: Type.NUMBER,
      description: "Number of particles (50-300). More for complex, less for simple.",
    },
    shape: {
      type: Type.STRING,
      enum: ["sphere", "heart", "star", "willow", "ring"],
      description: "The shape of the explosion.",
    },
    friction: {
      type: Type.NUMBER,
      description: "Air resistance (0.90 - 0.99). Higher = slower spread, better for willow.",
    },
    gravity: {
      type: Type.NUMBER,
      description: "Gravity effect (0.01 - 0.1). Lower for floaty/space feel.",
    },
    decay: {
      type: Type.NUMBER,
      description: "Fade out speed (0.005 - 0.03). Lower = longer lasting trails.",
    },
    initialVelocity: {
      type: Type.NUMBER,
      description: "Explosion force (3 - 15).",
    }
  },
  required: ["colors", "particleCount", "shape", "friction", "gravity", "decay", "initialVelocity"],
};

export const generateFireworkConfig = async (prompt: string): Promise<FireworkConfig> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Design a firework configuration based on this description: "${prompt}". 
      Translate the artistic description into physics parameters. 
      For example, 'slow falling gold' implies low gravity and low decay. 
      'Big boom' implies high initialVelocity.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: fireworkSchema,
        systemInstruction: "You are a master pyrotechnician. Create visually stunning firework parameters based on user descriptions.",
      },
    });

    const data = JSON.parse(response.text || "{}");

    // Map flat JSON back to our nested Config structure
    return {
      colors: data.colors || ["#ffffff"],
      particleCount: data.particleCount || 100,
      shape: (data.shape as FireworkShape) || "sphere",
      physics: {
        friction: data.friction || DEFAULT_PHYSICS.friction,
        gravity: data.gravity || DEFAULT_PHYSICS.gravity,
        initialVelocity: data.initialVelocity || DEFAULT_PHYSICS.initialVelocity,
        decay: data.decay || DEFAULT_PHYSICS.decay,
      }
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return a safe fallback with random colors if it fails
    return {
      colors: [`#${Math.floor(Math.random()*16777215).toString(16)}`],
      particleCount: 100,
      shape: 'sphere',
      physics: DEFAULT_PHYSICS
    };
  }
};
