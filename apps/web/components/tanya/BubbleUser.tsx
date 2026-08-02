type Props = {
  content: string;
  time: string;
};

export function BubbleUser({ content, time }: Props) {
  return (
    <div
      className="flex items-start justify-end gap-3"
      style={{ animation: "fade-in-up 0.35s ease-out forwards" }}
    >
      <div className="max-w-[80%]">
        <div className="rounded-2xl rounded-tr-md bg-sl-kilau-500 px-5 py-3.5 shadow-sm">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-white">
            {content}
          </p>
        </div>
        <p className="mt-1.5 pr-2 text-right text-[10px] text-sl-ink-500">
          {time}
        </p>
      </div>
    </div>
  );
}
