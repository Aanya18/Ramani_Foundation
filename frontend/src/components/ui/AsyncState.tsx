type AsyncStateProps = {
  loading: boolean;
  error: string | null;
  loadingLabel?: string;
  className?: string;
};

export function AsyncState({
  loading,
  error,
  loadingLabel = "Loading content...",
  className = "",
}: AsyncStateProps) {
  if (loading) {
    return (
      <div className={`panel p-6 text-sm text-ink/65 ${className}`}>
        {loadingLabel}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-[28px] border border-clay-300 bg-clay-100 p-6 text-sm text-clay-700 ${className}`}>
        {error}
      </div>
    );
  }

  return null;
}
