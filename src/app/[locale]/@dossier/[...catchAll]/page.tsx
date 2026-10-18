// A soft navigation elsewhere must empty the slot, or the overlay would stay
// open (slots keep their last state when the URL no longer matches them).
// Renders nothing, so there is nothing to make instant.
export const instant = false;

export default function CatchAll() {
  return null;
}
