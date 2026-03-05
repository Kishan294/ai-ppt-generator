"use server";

import { db } from "@/databases/drizzle";
import { presentation } from "@/databases/schema";
import { getCurrentUser } from "@/lib/auth-session";
import { PPTData } from "./ai-ppt";
import { eq, desc, and } from "drizzle-orm";
/**
 * Save a new presentation to the database.
 */
export async function savePresentation(data: {
  title: string;
  topic?: string;
  themeId: string;
  slideCount: number;
  content: PPTData;
}) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("You must be logged in to save a presentation");
  }

  const id = crypto.randomUUID();

  await db.insert(presentation).values({
    id,
    userId: user.id,
    title: data.title,
    topic: data.topic,
    themeId: data.themeId,
    slideCount: data.slideCount,
    content: data.content,
  });

  return id;
}

/**
 * Fetch all presentations for the current user.
 */
export async function getUserPresentations() {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  return await db.query.presentation.findMany({
    where: eq(presentation.userId, user.id),
    orderBy: [desc(presentation.createdAt)],
  });
}

/**
 * Fetch a single presentation by ID.
 */
export async function getPresentationById(id: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Not authenticated");
  }

  const result = await db.query.presentation.findFirst({
    where: eq(presentation.id, id),
  });

  if (!result || result.userId !== user.id) {
    throw new Error("Presentation not found");
  }

  return result;
}

/**
 * Delete a presentation.
 */
export async function deletePresentation(id: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Not authenticated");
  }

  await db
    .delete(presentation)
    .where(and(eq(presentation.id, id), eq(presentation.userId, user.id)));

  return { success: true };
}
