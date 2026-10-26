import NextImage, { type ImageProps } from "next/image";
import { versionedSrc } from "@/lib/img";

/**
 * Drop-in replacement for next/image that versions local photos,
 * so replacing a photo (even with the same file name) always shows the new one.
 */
export default function Image(props: ImageProps) {
  const src = typeof props.src === "string" ? versionedSrc(props.src) : props.src;
  // eslint-disable-next-line jsx-a11y/alt-text -- alt is passed through in props
  return <NextImage {...props} src={src} />;
}
