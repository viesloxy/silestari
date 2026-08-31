import Image from "next/image";
import Link from "next/link";
import type { Entry } from "@/lib/pocketbase";

type Props = {
  content: string;
  sources?: Entry[];
  time?: string;
};

export function BubbleAssistant({ content, sources, time }: Props) {
  return (
    <div
      className="flex items-start gap-3"
      style={{ animation: "fade-in-up 0.35s ease-out forwards" }}
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
      <div className="max-w-[80%]">
        <div className="rounded-2xl rounded-tl-md border border-sl-ink-100 bg-white px-5 py-3.5 shadow-sm">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-sl-ink-900">
            {content}
          </p>
        </div>

        {sources && sources.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-2">
            <span className="text-[11px] font-medium text-sl-ink-500">
              Sumber:
            </span>
            {sources.map((s) => (
              <Link
                key={s.id}
                href={`/kamus/${s.id}`}
                className="rounded-full border border-sl-kilau-200 bg-sl-kilau-50 px-2.5 py-0.5 text-[11px] font-semibold text-sl-kilau-700 transition-colors hover:bg-sl-kilau-100"
              >
                {s.kata} <span className="text-sl-kilau-600">·</span>{" "}
                {s.daerah}
              </Link>
            ))}
          </div>
        )}

        {time && (
          <p className="mt-1.5 pl-2 text-[10px] text-sl-ink-500">{time}</p>
        )}
      </div>
    </div>
  );
}
