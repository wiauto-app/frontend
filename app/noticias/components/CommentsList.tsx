type Comment = {
  document_id: string;
  name: string | null;
  email: string | null;
  text: string | null;
};

type CommentsListProps = {
  comments: Comment[];
};

// Placeholder avatar colors by index
const AVATAR_COLORS = [
  "bg-orange-400",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-pink-400",
  "bg-amber-500",
];

export const CommentsList = ({ comments }: CommentsListProps) => {
  if (!comments.length) {
    return (
      <p className="text-sm text-slate-500">
        Sé el primero en dejar un comentario.
      </p>
    );
  }

  return (
    <ul className="space-y-6">
      {comments.map((comment, idx) => (
        <li key={comment.document_id} className="flex gap-4">
          {/* Avatar */}
          <div
            className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold text-sm ${
              AVATAR_COLORS[idx % AVATAR_COLORS.length]
            }`}
          >
            {(comment.name ?? "A").charAt(0).toUpperCase()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-2 mb-1">
              <span className="text-sm font-bold text-slate-900">
                {comment.name ?? "Anónimo"}
              </span>
              {comment.email && (
                <span className="text-xs text-slate-400">
                  · {comment.email}
                </span>
              )}
            </div>
            {comment.text && (
              <p className="text-sm leading-relaxed text-slate-600 line-clamp-3">
                {comment.text}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};
