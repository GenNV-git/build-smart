/** Content notes (editor hints) are shown in development, or anywhere with NEXT_PUBLIC_SHOW_CONTENT_NOTES=true. */
export const showContentNotes =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_CONTENT_NOTES === "true";
