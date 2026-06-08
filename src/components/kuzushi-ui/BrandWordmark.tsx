import Image from "next/image";
import Link from "next/link";

export function BrandWordmark({
  href,
  label = "Kuzushi Cafe",
  compact = false,
}: {
  href?: string;
  label?: string;
  compact?: boolean;
}) {
  const className = [
    "inline-flex items-center gap-2 font-black italic tracking-tight text-zinc-950",
    compact ? "text-sm" : "text-lg",
  ].join(" ");
  const content = (
    <>
      <Image
        src="/kuzushi-cafe.svg"
        alt=""
        width={20}
        height={20}
        aria-hidden="true"
      />
      <span>{label}</span>
    </>
  );

  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <span className={className}>{content}</span>
  );
}
