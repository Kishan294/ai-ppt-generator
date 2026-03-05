"use server";

import { groq } from "@ai-sdk/groq";
import { generateText, Output } from "ai";
import { z } from "zod";

const groqApiKey = process.env.GROQ_API_KEY;

export interface Slide {
  title: string;
  content: string[];
}

export interface PPTData {
  title: string;
  slides: Slide[];
}

const pptSchema = z.object({
  title: z.string().describe("Main Title of Presentation"),
  slides: z.array(
    z.object({
      title: z.string().describe("Slide Title"),
      content: z.array(z.string()).describe("Bullet points for the slide"),
    }),
  ),
});

/**
 * Mode 1: Generate from a topic
 */
export async function generatePPTContent(
  topic: string,
  slideCount: number = 5,
): Promise<PPTData> {
  if (!groqApiKey) {
    throw new Error("GROQ_API_KEY is missing from environment variables.");
  }

  try {
    const { output } = await generateText({
      // Llama 3.1 70B supports Structured Outputs on Groq
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      output: Output.object({
        schema: pptSchema,
      }),
      prompt: `
        Task: Generate a presentation structure.
        Topic: "${topic}"
        Target Slide Count: ${slideCount}
        
        Requirements:
        - Professional, informative, and engaging content.
        - Title should be compelling.
        - Each slide must have a title and a list of 3-5 bullet points.
      `,
    });

    return output as PPTData;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("generatePPTContent error:", errorMessage);

    if (
      errorMessage.includes("429") ||
      errorMessage.includes("limit") ||
      errorMessage.includes("quota")
    ) {
      throw new Error("AI_QUOTA_REACHED");
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
  if (!groqApiKey) {
    throw new Error("GROQ_API_KEY is missing from environment variables.");
  }

  try {
    const { output } = await generateText({
      // Llama 3.1 70B supports Structured Outputs on Groq
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      output: Output.object({
        schema: pptSchema,
      }),
      prompt: `
        Task: Create a professional presentation from the provided content.
        Rules:
        - Analyze the input and extract key themes.
        - Structure it with a clear narrative (Intro -> Core Sections -> Conclusion).
        - Each slide: Concise title + 3-6 clear bullet points.
        - Generate between 4 to 8 slides depending on depth of content.
        - Use professional tone.
        - Do not invent facts not present in text.
        
        User Content:
        """
        ${content}
        """
      `,
    });

    return output as PPTData;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("generatePPTFromContent Error:", errorMessage);

    if (
      errorMessage.includes("429") ||
      errorMessage.includes("limit") ||
      errorMessage.includes("quota")
    ) {
      throw new Error("AI_QUOTA_REACHED");
    }

    throw new Error(
      "Failed to structure your content into slides. Please try again.",
    );
  }
}
