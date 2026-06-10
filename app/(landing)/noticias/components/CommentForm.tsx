"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="news_document_id" value={news_document_id} />
      <input type="hidden" name="news_slug" value={news_slug} />

      <h2 className="text-xl font-bold text-slate-900 mb-4">Dejar un comentario</h2>

      {/* Name + Email row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="comment-name" className="text-slate-700">
            Nombre <span className="text-red-500">*</span>
          </Label>
          <Input
            id="comment-name"
            name="name"
            type="text"
            required
            placeholder="Nombre"
            disabled={is_pending}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="comment-email" className="text-slate-700">
            Correo <span className="text-red-500">*</span>
          </Label>
          <Input
            id="comment-email"
            name="email"
            type="email"
            required
            placeholder="Correo"
            disabled={is_pending}
          />
        </div>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="comment-text" className="text-slate-700">
          Mensaje <span className="text-red-500">*</span>
        </Label>
        <textarea
          id="comment-text"
          name="text"
          required
          rows={5}
          placeholder="Escribe tu comentario..."
          disabled={is_pending}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60 resize-none"
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

      <Button
        type="submit"
        disabled={is_pending}
        className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2.5 font-semibold"
      >
        {is_pending ? "Enviando..." : "Enviar comentario"}
      </Button>
    </form>
  );
};
