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
  const cleanText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
  return JSON.parse(cleanText) as PPTData;
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

  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-lite-preview",
  });

  const prompt = `
    Generate a presentation structure for the topic: "${topic}".
    The presentation should have approximately ${slideCount} slides.
    Format the output as a valid JSON object with the following structure:
    ${JSON_SCHEMA}
    Ensure the content is professional, concise, and informative.
    Return ONLY the raw JSON string.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return parseResponse(response.text());
  } catch (error) {
    console.error("Error generating AI content:", error);
    throw new Error(
      "Failed to generate presentation content. Please try again.",
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
    model: "gemini-3-flash-preview",
  });

  const prompt = `
    You are a professional presentation designer. The user has provided the following raw content.
    Your job is to analyze it and create a well-structured, professional presentation from it.

    RULES:
    - Extract the key themes, arguments, and data points from the content.
    - Create a clear narrative arc: introduction, key sections, and conclusion.
    - Each slide should have a concise title and 3-6 bullet points.
    - Bullet points should be clear, concise sentences (not paragraphs).
    - Generate between 4-8 slides depending on content length.
    - Give the presentation a professional, compelling title.
    - DO NOT add information that isn't in or implied by the original content.

    USER CONTENT:
    """
    ${content}
    """

    Format the output as a valid JSON object with the following structure:
    ${JSON_SCHEMA}
    Return ONLY the raw JSON string. No markdown, no explanation.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return parseResponse(response.text());
  } catch (error) {
    console.error("Error generating AI content from paste:", error);
    throw new Error(
      "Failed to structure your content into slides. Please try again.",
    );
  }
}
