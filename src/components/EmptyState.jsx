export function EmptyState({ title, description, action, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-10 text-center">
      {Icon ? <Icon className="mb-3 size-6 text-muted-foreground" aria-hidden="true" /> : null}
      <p className="font-serif text-lg text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm">
      <p className="font-medium text-foreground">Something went wrong with your local database</p>
      <p className="mt-1 text-muted-foreground">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 inline-flex min-h-11 items-center rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-accent">
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function LoadingState({ label = "Loading your journal…" }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm text-muted-foreground">
      <span className="size-2 animate-pulse rounded-full bg-foreground/40" aria-hidden="true" />
      <span role="status">{label}</span>
    </div>
  );
}
