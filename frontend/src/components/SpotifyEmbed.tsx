export default function SpotifyEmbed() {
  const embedUrl = process.env.NEXT_PUBLIC_SPOTIFY_EMBED_URL;

  if (!embedUrl) return null;

  return (
    <section className="mt-16 mb-8" id="spotify-section">
      <h2 className="text-[15px] font-medium text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] mb-4">
        Currently listening
      </h2>
      <div className="rounded-xl overflow-hidden border border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
        <iframe
          src={embedUrl}
          width="100%"
          height="152"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="block"
          title="Spotify player"
        />
      </div>
    </section>
  );
}
