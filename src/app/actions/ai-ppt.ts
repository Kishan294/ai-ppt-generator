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

export async function generatePPTContent(
  topic: string,
  slideCount: number = 5,
): Promise<PPTData> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
  });

  const prompt = `
    Generate a presentation structure for the topic: "${topic}".
    The presentation should have approximately ${slideCount} slides.
    Format the output as a valid JSON object with the following structure:
    {
      "title": "Main Title of Presentation",
      "slides": [
        {
          "title": "Slide Title",
          "content": ["Bullet point 1", "Bullet point 2", "Bullet point 3"]
        }
      ]
    }
    Ensure the content is professional, concise, and informative.
    Return ONLY the raw JSON string.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response in case the model adds markdown code blocks
    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanText) as PPTData;
  } catch (error) {
    console.error("Error generating AI content:", error);
    throw new Error(
      "Failed to generate presentation content. Please try again.",
    );
  }
}
