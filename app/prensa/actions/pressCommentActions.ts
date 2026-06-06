"use server";

import { revalidatePath } from "next/cache";
import { pressCommentService } from "../services/pressCommentService";

export type CreatePressCommentActionState = {
  success: boolean;
  message: string;
};

export const createPressCommentAction = async (
  _prev_state: CreatePressCommentActionState,
  form_data: FormData,
): Promise<CreatePressCommentActionState> => {
  const news_document_id = String(form_data.get("news_document_id") ?? "").trim();
  const news_slug = String(form_data.get("news_slug") ?? "").trim();
  const name = String(form_data.get("name") ?? "").trim();
  const email = String(form_data.get("email") ?? "").trim();
  const text = String(form_data.get("text") ?? "").trim();

  if (!news_document_id || !news_slug) {
    return { success: false, message: "Invalid article reference." };
  }
  if (!name || !email || !text) {
    return { success: false, message: "Please fill in all fields." };
  }

  try {
    await pressCommentService.create({ name, email, text, news_document_id });
    revalidatePath(`/prensa/${news_slug}`);
    revalidatePath("/prensa");
    return { success: true, message: "Comment posted successfully." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not post the comment.";
    return { success: false, message };
  }
};
