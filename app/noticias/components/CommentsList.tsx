import type { NewsComment } from "../types/news.types";

type CommentsListProps = {
  comments: NewsComment[];
};

export const CommentsList = ({ comments }: CommentsListProps) => {
  if (!comments.length) {
    return (
      <p className="text-sm text-slate-500">
        No comments yet. Be the first to leave one.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {comments.map((comment) => (
        <li
          key={comment.document_id}
          className="rounded-lg border border-slate-200 bg-slate-50 p-4"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-semibold text-slate-900">
              {comment.name ?? "Anonymous"}
            </p>
            {comment.email ? (
              <p className="text-xs text-slate-400">{comment.email}</p>
            ) : null}
          </div>
          {comment.text ? (
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              {comment.text}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
};
