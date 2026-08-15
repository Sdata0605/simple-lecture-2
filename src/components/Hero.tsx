import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { HeroVideoSettings } from "@/hooks/useHomepageData";
import { HeroLecturePlayer } from "@/components/HeroLecturePlayer";
import { HeroV4Launcher } from "@/components/HeroV4Launcher";
import { HeroArchesBackground } from "@/components/HeroArchesBackground";
import { HOMEPAGE_HERO_LECTURE } from "@/lib/homepageHeroLecture";

const heroSlideData = [
  {
    title: "SSLC board preparation is now available.",
    subtitle: "Score 90+ with calm, focused AI tutoring across every subject.",
    cta: "Discover the courses",
  },
  {
    title: "Board prep, refined for every subject.",
    subtitle: "Maths, Science, Social Studies — chapter-wise lessons and mock tests.",
    cta: "Discover the courses",
  },
  {
    title: "Learn with quiet confidence.",
    subtitle: "24/7 AI doubt clearing in Kannada, Hindi & English from ₹1000 + GST.",
    cta: "Discover the courses",
  },
];

interface HeroProps {
  heroVideoSettings?: HeroVideoSettings;
}

export const Hero = (_props: HeroProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      if (!document.hidden) {
        setCurrentSlide((prev) => (prev + 1) % heroSlideData.length);
      }
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handleCtaClick = () => {
    navigate("/course/Class-10");
  };

  return (
    <section className="relative min-h-[88vh] lg:min-h-screen flex flex-col overflow-clip bg-[#011425]">
      <HeroArchesBackground />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        {heroSlideData.map((slide, index) => (
          <div
            key={index}
            className={`max-w-4xl transition-opacity duration-700 ${
              currentSlide === index
                ? "opacity-100"
                : "opacity-0 absolute pointer-events-none"
            }`}
          >
            <h1 className="font-serif font-light text-white text-[2.35rem] leading-[1.15] tracking-tight md:text-6xl lg:text-7xl">
              {slide.title}
            </h1>
            <p className="mt-6 font-serif text-lg font-light text-white/80 md:text-xl">
              {slide.subtitle}
            </p>
            <div className="mt-10 flex flex-col items-center gap-5">
              <button
                type="button"
                onClick={handleCtaClick}
                className="font-serif text-lg text-white underline decoration-white/70 underline-offset-[10px] transition-colors hover:decoration-white md:text-xl"
              >
                {slide.cta}
              </button>
              <button
                type="button"
                onClick={() => navigate("/course/Class-10/preview")}
                className="font-serif text-sm tracking-[0.18em] uppercase text-[#5C7C89] hover:text-white transition-colors"
              >
                Explore free lessons
              </button>
            </div>
          </div>
        ))}

        <div className="mt-12 flex gap-3">
          {heroSlideData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                currentSlide === index ? "w-10 bg-white" : "w-4 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[515px] px-4 pb-8">
        {HOMEPAGE_HERO_LECTURE.player === "v4" ? (
          <HeroV4Launcher
            jobId={HOMEPAGE_HERO_LECTURE.jobId}
            vimeoId={HOMEPAGE_HERO_LECTURE.vimeoId}
            videoMp4Url={HOMEPAGE_HERO_LECTURE.videoMp4Url}
            title={HOMEPAGE_HERO_LECTURE.title}
            subtitle={HOMEPAGE_HERO_LECTURE.subtitle}
            forceCompact
            mobileExtraHeight={30}
          />
        ) : (
          <HeroLecturePlayer
            jobId={HOMEPAGE_HERO_LECTURE.jobId}
            title={HOMEPAGE_HERO_LECTURE.title}
            subtitle={HOMEPAGE_HERO_LECTURE.subtitle}
            forceCompact
            mobileExtraHeight={30}
          />
        )}
      </div>

      <div className="relative z-10 flex justify-center pb-10">
        <a
          href="#explore-programs"
          className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#242424] text-[11px] font-medium tracking-[0.28em] text-white shadow-[0_12px_40px_rgba(1,20,37,0.45)] ring-1 ring-white/10 transition-transform hover:scale-105"
        >
          MENU
        </a>
      </div>
    </section>
  );
};
