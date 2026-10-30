import type { Metadata } from "next";
import { featuredVideo, videos } from "@/content/videos";
import { isSet, site } from "@/content/site";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DevNote } from "@/components/ui/DevNote";
import { VideoCard } from "@/components/video/VideoCard";
import { VideoGallery } from "@/components/video/VideoGallery";
import { InstagramIcon, YouTubeIcon } from "@/components/ui/Icons";
import { CtaBanner } from "@/components/layout/CtaBanner";
import { images } from "@/content/images";

export const metadata: Metadata = {
  title: "Videos & Reels",
  description: "Site visits, project progress, handovers and behind-the-scenes Reels and Shorts from Sanjay and the Build Smart team.",
  alternates: { canonical: "/videos" },
  openGraph: { title: "Videos & Reels | Build Smart", url: "/videos" },
};

export default function VideosPage() {
  const configured = videos.filter((v) => isSet(v.url)).length;
  return (
    <>
      <PageHero
        eyebrow="Videos & Reels"
        title="Beyond the Blueprint."
        intro="On site, in the details, and behind the scenes — follow Sanjay as he shares real progress, honest lessons and finished homes."
        image={images.videosHero}
      >
        <div className="mt-9 flex flex-wrap gap-3">
          {isSet(site.founderSocial.instagram) && (
            <a href={site.founderSocial.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-sm w-full min-[400px]:w-auto">
              <InstagramIcon className="size-4" /> Follow {site.founderSocial.instagramHandle}
            </a>
          )}
          {isSet(site.founderSocial.youtube) && (
            <a href={site.founderSocial.youtube} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light btn-sm w-full min-[400px]:w-auto">
              <YouTubeIcon className="size-4" /> Subscribe on YouTube
            </a>
          )}
        </div>
      </PageHero>

      <section aria-labelledby="featured-video-title" className="py-14 sm:py-20 lg:py-24">
        <div className="container-lux grid items-center gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
          <div data-reveal>
            <VideoCard video={featuredVideo} size="featured" />
          </div>
          <div data-reveal>
            <p className="eyebrow">Featured</p>
            <h2 id="featured-video-title" className="mt-4 text-4xl text-espresso sm:text-5xl">
              {featuredVideo.title}
            </h2>
            <p className="mt-4 leading-relaxed text-muted">{featuredVideo.subtitle}.</p>
          </div>
        </div>
        {configured === 0 && (
          <div className="container-lux mt-8">
            <DevNote>Paste Reel / Short URLs into src/content/videos.ts — cards switch from &quot;Coming soon&quot; to playable automatically.</DevNote>
          </div>
        )}
      </section>

      <section aria-labelledby="all-videos-title" className="bg-ivory py-14 sm:py-20 lg:py-28">
        <div className="container-lux">
          <SectionHeading id="all-videos-title" eyebrow="The Collection" title="Site visits, progress & handovers." className="mb-10" />
          <VideoGallery videos={videos} />
        </div>
      </section>

      <CtaBanner title="Like what you see?" text="Let's talk about building something like it for you." source="videos-cta" />
    </>
  );
}
