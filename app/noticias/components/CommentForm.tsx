"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createCommentAction,
  type CreateCommentActionState,
} from "../actions/commentActions";

const initial_state: CreateCommentActionState = {
  success: false,
  message: "",
};

type CommentFormProps = {
  news_document_id: string;
  news_slug: string;
};

export const CommentForm = ({ news_document_id, news_slug }: CommentFormProps) => {
  const [state, formAction, is_pending] = useActionState(
    createCommentAction,
    initial_state,
  );

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
      <input type="hidden" name="news_document_id" value={news_document_id} />
      <input type="hidden" name="news_slug" value={news_slug} />

      <div>
        <h3 className="text-lg font-semibold text-slate-900">Leave a comment</h3>
        <p className="mt-1 text-sm text-slate-500">
          Your comment will be saved in Strapi and linked to this article.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="comment-name" className="text-sm font-medium text-slate-700">
            Name
          </label>
          <Input
            id="comment-name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            disabled={is_pending}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="comment-email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <Input
            id="comment-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            disabled={is_pending}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="comment-text" className="text-sm font-medium text-slate-700">
          Comment
        </label>
        <Textarea
          id="comment-text"
          name="text"
          required
          rows={4}
          placeholder="Write your comment..."
          disabled={is_pending}
        />
      </div>

      {state.message ? (
        <p
          className={`text-sm ${state.success ? "text-green-600" : "text-red-600"}`}
          role="status"
        >
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={is_pending}>
        {is_pending ? "Sending..." : "Post comment"}
      </Button>
    </form>
  );
};
