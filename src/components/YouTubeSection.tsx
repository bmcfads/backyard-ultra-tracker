interface YouTubeSectionProps {
  videoIds: string[];
}

export function YouTubeSection({ videoIds }: YouTubeSectionProps) {
  if (videoIds.length === 0) {
    return (
      <p className="text-muted text-sm text-center py-4">No update videos posted yet.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {videoIds.map((id) => (
        <div key={id} className="relative aspect-[9/16]">
          <iframe
            src={`https://www.youtube.com/embed/${id}`}
            className="absolute inset-0 w-full h-full rounded"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ))}
    </div>
  );
}
