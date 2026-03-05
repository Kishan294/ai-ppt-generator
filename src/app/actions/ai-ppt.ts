"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export interface Slide {
  title: string;
  content: string[];
}

export interface PPTData {
  title: string;
  slides: Slide[];
}

const JSON_SCHEMA = `
{
  "title": "Main Title of Presentation",
  "slides": [
    {
      "title": "Slide Title",
      "content": ["Bullet point 1", "Bullet point 2", "Bullet point 3"]
    }
  ]
}`;

function parseResponse(text: string): PPTData {
  // Try to find JSON block in case response includes text around it
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const cleanText = jsonMatch ? jsonMatch[0] : text;

  try {
    const data = JSON.parse(cleanText) as PPTData;
    if (!data.title || !Array.isArray(data.slides)) {
      throw new Error("INVALID_DATA_STRUCTURE");
    }
    return data;
  } catch {
    console.error(
      "AI JSON Parse Failure. Raw length:",
      text.length,
      "Preview:",
      text.substring(0, 100),
    );
    throw new Error("AI_FORMAT_ERROR");
  }
}

/**
 * Mode 1: Generate from a topic
 */
export async function generatePPTContent(
  topic: string,
  slideCount: number = 5,
): Promise<PPTData> {
  if (!apiKey) {
    throw new Error("API configuration is missing.");
  }

  // Use Gemini 2.0 Flash for superior performance and reliable JSON output
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
  });

  const prompt = `
    Task: Generate a presentation structure.
    Topic: "${topic}"
    Target Slide Count: ${slideCount}
    
    Requirements:
    - Professional, informative, and engaging content.
    - Title should be compelling.
    - Each slide must have a title and a list of 3-5 bullet points.
    
    Output Format (JSON):
    ${JSON_SCHEMA}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return parseResponse(response.text());
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("generatePPTContent error:", errorMessage);

    if (errorMessage.includes("429") || errorMessage.includes("quota")) {
      throw new Error("AI_QUOTA_REACHED");
    }

    if (errorMessage === "AI_FORMAT_ERROR") {
      throw new Error("AI_FORMAT_ERROR");
    }

    throw new Error(
      "Failed to generate presentation content. The AI encountered an error.",
    );
  }
}

/**
 * Mode 2: Generate from pasted content / raw text
 */
export async function generatePPTFromContent(
  content: string,
): Promise<PPTData> {
  if (!apiKey) {
    throw new Error("API configuration is missing.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt = `
    Task: Create a professional presentation from the provided content.
    Rules:
    - Analyze the input and extract key themes.
    - Structure it with a clear narrative (Intro -> Core Sections -> Conclusion).
    - Each slide: Concise title + 3-6 clear bullet points.
    - Generate 4 to 8 slides based on depth of content.
    
    User Content:
    """
    ${content}
    """

    Directives:
    - Use professional tone.
    - Do not invent facts not present in text.
    
    Output JSON Schema:
    ${JSON_SCHEMA}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return parseResponse(response.text());
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("generatePPTFromContent Error:", errorMessage);

    if (errorMessage.includes("429") || errorMessage.includes("quota")) {
      throw new Error("AI_QUOTA_REACHED");
    }

    if (errorMessage === "AI_FORMAT_ERROR") {
      throw new Error("AI_FORMAT_ERROR");
    }

    throw new Error(
      "Failed to structure your content into slides. Please try again.",
    );
  }
}
