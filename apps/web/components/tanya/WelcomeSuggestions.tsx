"use client";

const suggestions = [
  "apa Bahasa Jawa untuk cantik?",
  "peribahasa Minang tentang alam",
  "arti canang dalam Bahasa Bali",
  "kata sapaan Batak yang umum",
];

type Props = {
  onSelect: (text: string) => void;
};

export function WelcomeSuggestions({ onSelect }: Props) {
  return (
    <div className="ml-11 mt-2 space-y-2">
      <p className="text-xs font-medium text-sl-ink-500">Coba tanya:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => onSelect(s)}
            className="cursor-pointer rounded-full border border-sl-ink-200 bg-white px-3 py-1.5 text-xs text-sl-ink-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sl-kilau-300 hover:bg-sl-kilau-50 hover:text-sl-kilau-700"
            style={{
              animation: `fade-in-up 0.5s ease-out ${i * 80}ms forwards`,
              opacity: 0,
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
