import Link from "next/link";

export function SunsetBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] w-full bg-secondary border-b border-border text-foreground">
      <div className="px-4 h-9 flex items-center justify-center gap-2 text-xs sm:text-sm font-sans text-center">
        <span>Theo is launching soon.</span>
        <Link
          href="#features"
          className="underline underline-offset-2 hover:text-foreground/80 transition-colors"
        >
          Read more
        </Link>
      </div>
    </div>
  );
}
