import Image from "next/image";

export function BubbleTyping() {
  return (
    <div
      className="flex items-start gap-3"
      style={{ animation: "fade-in-up 0.35s ease-out forwards" }}
      aria-live="polite"
      aria-label="Si Lestari sedang mengetik"
    >
      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-sl-kilau-200">
        <Image
          src="/brand/mascot.png"
          alt=""
          aria-hidden
          fill
          sizes="32px"
          className="object-cover"
        />
      </div>
      <div className="rounded-2xl rounded-tl-md border border-sl-ink-100 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-sl-ink-300"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-sl-ink-300"
            style={{ animationDelay: "200ms" }}
          />
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-sl-ink-300"
            style={{ animationDelay: "400ms" }}
          />
        </div>
      </div>
    </div>
  );
}
