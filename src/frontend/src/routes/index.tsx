import { Button } from "@/components/ui/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import { BarChart3, Battery, ChevronRight, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({ component: OnboardingPage });

const SLIDES = [
  {
    icon: Zap,
    title: "Welcome to\nSabi Solar",
    description:
      "Monitor your solar energy anywhere. Track generation, consumption and savings — all in one place.",
  },
  {
    icon: BarChart3,
    title: "Real-time\nMonitoring",
    description:
      "Watch your panels generate clean energy live. See solar vs. grid data refreshed every 30 seconds.",
  },
  {
    icon: Battery,
    title: "Get Started\nToday",
    description:
      "Add your property, link your solar system, and start tracking your energy and CO₂ savings instantly.",
  },
];

function OnboardingPage() {
  const navigate = useNavigate();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [current, setCurrent] = useState(0);
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem("splashShown"),
  );

  // Splash auto-dismiss after 2500ms
  useEffect(() => {
    if (!showSplash) return;
    const id = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem("splashShown", "true");
    }, 2500);
    return () => clearTimeout(id);
  }, [showSplash]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setCurrent(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const goToAuth = () => navigate({ to: "/auth" });
  const isLast = current === SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      goToAuth();
    } else {
      emblaApi?.scrollNext();
    }
  };

  // ── Splash screen ────────────────────────────────────────────────────
  if (showSplash) {
    return (
      <div
        data-ocid="splash.page"
        className="fixed inset-0 w-screen h-screen z-50 overflow-hidden"
      >
        {/* Background image */}
        <img
          src="/splash-bg.jpg"
          alt="Sabi Solar"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Centered content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-3xl bg-emerald-400/20 border-2 border-emerald-400/50 flex items-center justify-center shadow-xl">
              <Zap size={40} className="text-emerald-400" strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight font-display">
              Sabi Solar
            </h1>
            <p className="text-lg text-emerald-400 mt-1">
              Smart Energy Monitoring
            </p>
          </div>
        </div>
        {/* Pulsing dots */}
        <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2 z-10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse [animation-delay:0.2s]" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse [animation-delay:0.4s]" />
        </div>
      </div>
    );
  }

  // ── Onboarding carousel ──────────────────────────────────────────────
  return (
    <div
      data-ocid="onboarding.page"
      className="min-h-screen flex flex-col bg-background"
    >
      {/* Skip button */}
      <div className="flex justify-end px-6 pt-12">
        <button
          type="button"
          onClick={goToAuth}
          data-ocid="onboarding.skip_button"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
        >
          Skip
        </button>
      </div>

      {/* Embla carousel */}
      <div ref={emblaRef} className="flex-1 overflow-hidden">
        <div className="flex h-full">
          {SLIDES.map((slide, i) => {
            const Icon = slide.icon;
            return (
              <div
                key={slide.title}
                className="flex-none w-full flex flex-col items-center justify-center px-8 gap-6"
                data-ocid={`onboarding.slide.${i + 1}`}
              >
                {/* Glow + icon */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-primary/15 blur-2xl" />
                  <div className="relative z-10 w-28 h-28 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-lg">
                    <Icon
                      size={52}
                      className="text-primary"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                <div className="text-center max-w-xs">
                  <h1 className="text-3xl font-bold text-foreground font-display whitespace-pre-line leading-tight mb-3">
                    {slide.title}
                  </h1>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {slide.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="px-6 pb-10 flex flex-col items-center gap-5">
        {/* Dot indicators */}
        <div
          className="flex gap-2"
          role="tablist"
          aria-label="Onboarding steps"
        >
          {SLIDES.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              role="tab"
              aria-selected={i === current}
              data-ocid={`onboarding.dot.${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-2 bg-primary"
                  : "w-2 h-2 bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>

        <Button
          type="button"
          onClick={handleNext}
          data-ocid="onboarding.next_button"
          className="w-full h-14 rounded-2xl text-base font-semibold flex items-center justify-center gap-2"
          size="lg"
        >
          {isLast ? "Get Started" : "Next"}
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
}
