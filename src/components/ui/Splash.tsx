import Image from "@/components/ui/Image";
import { site } from "@/content/site";

/**
 * Opening screen: the Build Smart mark on a dark background for about one second, then it lifts away.
 * Driven purely by CSS (see ".splash" in globals.css), so it can never get stuck — even if scripts fail to load.
 * Shown when the site is opened or reloaded, not when moving between pages inside the site.
 * To change the time, edit --splash-time in globals.css; to remove it, delete <Splash /> from src/app/layout.tsx.
 */
export function Splash() {
  return (
    <div className="splash" aria-hidden="true">
      <div className="splash-inner">
        <span className="splash-ring" />
        <Image src="/images/brand/logo-mark.png" alt="" width={218} height={150} priority className="splash-logo" />
        <span className="splash-bar">
          <span />
        </span>
        <span className="splash-tag">{site.tagline}</span>
      </div>
    </div>
  );
}
