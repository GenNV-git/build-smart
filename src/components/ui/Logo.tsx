import Image from "@/components/ui/Image";
import Link from "next/link";

/** Official Build Smart mark (extracted from the supplied logo — proportions preserved). */
export function Logo({
  variant = "light",
  className = "",
  height = 44,
  priority = false,
}: {
  variant?: "light" | "dark";
  className?: string;
  height?: number;
  priority?: boolean;
}) {
  const src = variant === "light" ? "/images/brand/logo-mark.png" : "/images/brand/logo-mark-dark.png";
  const width = Math.round(height * (655 / 450));
  return (
    <Link href="/" aria-label="Build Smart — home" className={`inline-flex shrink-0 items-center ${className}`}>
      <Image src={src} alt="Build Smart" width={width} height={height} priority={priority} style={{ height, width: "auto" }} />
    </Link>
  );
}
