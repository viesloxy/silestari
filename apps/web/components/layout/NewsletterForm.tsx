"use client";

import { MailIcon } from "lucide-react";

export function NewsletterForm() {
  return (
    <form
      className="group flex w-full flex-col gap-3 sm:flex-row md:w-auto"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        required
        placeholder="alamat.email@kamu.id"
        aria-label="Alamat email untuk berlangganan"
        className="h-14 flex-1 cursor-text rounded-full border border-sl-ink-200 bg-white px-5 py-4 text-base text-sl-ink-900 placeholder:text-sl-ink-300 transition-all duration-300 focus:border-sl-kilau-400 focus:outline-none focus:ring-2 focus:ring-sl-kilau-200 sm:h-12 sm:py-2 sm:text-sm md:w-72"
      />
      <button
        type="submit"
        className="btn-pill btn-pill-lg btn-pill-primary h-14 sm:h-auto"
      >
        <MailIcon className="h-4 w-4" />
        Berlangganan
      </button>
    </form>
  );
}
