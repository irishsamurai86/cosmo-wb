"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * WestBloomfieldLanding
 *
 * Conventions (to prevent accidental deletions during iterative edits):
 * - DATA lives in `CONTENT_*` blocks.
 * - UI blocks are isolated components.
 * - Page layout uses SECTION markers (searchable).
 * - If you add/remove a feature, do it by editing the relevant SECTION only.
 */

const TOUR_BOOKING_URL =
  "https://api.cosmosalonstudios.com/widget/booking/XKQxxfMpeAtAFVuOh84T";
const CALL_BOOKING_URL =
  "https://api.cosmosalonstudios.com/widget/booking/rTXPD4SlT0wj9UKBzTHa";

const DESKTOP_BREAKPOINT_PX = 768;

// Keep this pure + testable.
export function shouldOpenBookingInNewTab(viewportWidthPx: number): boolean {
  return viewportWidthPx >= DESKTOP_BREAKPOINT_PX;
}

function getViewportWidthPx(): number {
  // Guard for SSR / prerender.
  if (typeof window === "undefined") return 0;
  return window.innerWidth || 0;
}

function openBookingPreferC(e?: React.MouseEvent<HTMLElement>) {
  // C) desktop new tab, mobile same tab
  if (typeof window === "undefined") return;

  const viewportWidthPx = getViewportWidthPx();
  const desktop = shouldOpenBookingInNewTab(viewportWidthPx);

  if (!desktop) {
    // Mobile: allow normal navigation (same tab) for max success.
    return;
  }

  // Desktop: open new tab/window. Prevent default navigation so we don't also navigate.
  if (e?.preventDefault) e.preventDefault();
  window.open(TOUR_BOOKING_URL, "_blank", "noopener,noreferrer");
}

type StorySlide = {
  img: string;
  caption: string;
  cta?: { label: string; href: string };
};

type Story = {
  id: string;
  title: string;
  coverImg: string;
  slides: StorySlide[];
};

type Person = {
  id: string;
  name: string;
  role: string;
  img: string;
  badge?: string;
};

type FeedPost = {
  id: string;
  img?: string;
  videoSrc?: string;
  videoPoster?: string;
  title: string;
  body: React.ReactNode;
  microUrgency?: React.ReactNode;
  primaryCta: {
    label: string;
    href: string;
    variant: "gradient" | "black" | "green" | "white";
    isTour?: boolean;
  };
  firstComment: {
    name: string;
    text: string;
    ctaText?: string;
    ctaHref?: string;
    isTour?: boolean;
  };
};

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export default function WestBloomfieldLanding() {
  // =========================
  // STATE
  // =========================
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  

  // Micro interactions
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [likeBurstPostId, setLikeBurstPostId] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  // Story modal
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [storySlideIndex, setStorySlideIndex] = useState(0);

  // Identity toggle
  const [identityChoice, setIdentityChoice] = useState<string | null>(null);

  // Chat message timing
  const [showChatSecondBubble, setShowChatSecondBubble] = useState(false);

  // Revenue mini calculator (feed item)
  const [calcWeeklyRent, setCalcWeeklyRent] = useState(295);
  const [calcWeeklyRevenue, setCalcWeeklyRevenue] = useState(2500);
  const [applyPromo, setApplyPromo] = useState(false);

  const annualRevenue = calcWeeklyRevenue * 52;
  const annualRentStandard = calcWeeklyRent * 52;
  const annualRentPromo = calcWeeklyRent * 44;

  const monthlyTakeHomeStandard = Math.round(
    (annualRevenue - annualRentStandard) / 12
  );
  const monthlyTakeHomePromo = Math.round((annualRevenue - annualRentPromo) / 12);

  const estimatedMonthlyTakeHome = applyPromo
    ? monthlyTakeHomePromo
    : monthlyTakeHomeStandard;

  const monthlyDelta = monthlyTakeHomePromo - monthlyTakeHomeStandard;
  const annualDelta = monthlyDelta * 12;

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2000);
  };

  const toggleSave = (postId: string) => {
    setSavedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
    showToast("Saved. We’ll remind you about availability.");
  };

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
    setLikeBurstPostId(postId);
    window.setTimeout(() => {
      setLikeBurstPostId((curr) => (curr === postId ? null : curr));
    }, 550);
  };

  // =========================
  // LIVE ACTIVITY DATA
  // =========================

  const LIVE_ACTIVITY_MESSAGES = useMemo(
    () => [
      "🔥 WB tours happening daily — private showings only",
      "💎 Elite beauty pros upgrading to private studios",
      "📈 Strategy calls booked this week",
      "✨ 376+ premium beauty brands inside Cosmo",
      "🔒 West Bloomfield suites getting claimed quietly",
    ],
    []
  );

  // Static live activity (removed interval to prevent re-renders during scroll)
  const liveIndex = 0;

  const LiveActivityBar = () => (
    <div className="mt-6 w-full max-w-md mx-auto">
      <div className="bg-black text-white text-xs font-semibold px-4 py-2 rounded-full text-center shadow-sm">
        {LIVE_ACTIVITY_MESSAGES[liveIndex]}
      </div>
    </div>
  );

  // =========================
  // CONTENT (EDIT HERE FIRST)
  // =========================

  const CONTENT_STORIES: Story[] = useMemo(
    () => [
      {
        id: "story-available",
        title: "Available Suites",
        coverImg:
          "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-d2.jpg",
        slides: [
          {
            img: "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-d2.jpg",
            caption: "Private, fully customizable studios.",
          },
          {
            img: "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-a3-1024x882.jpg",
            caption: "Luxury finishes included.",
          },
          {
            img: "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-d3.jpg",
            caption: "Book a tour before they’re gone.",
            cta: { label: "Book a Tour", href: TOUR_BOOKING_URL },
          },
        ],
      },
      {
        id: "story-wb",
        title: "WB Location",
        coverImg:
          "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-a3-1024x882.jpg",
        slides: [
          {
            img: "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-a3-1024x882.jpg",
            caption: "West Bloomfield traffic + affluent clientele.",
          },
          {
            img: "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-d2.jpg",
            caption: "Clients pay more when your space looks premium.",
          },
          {
            img: "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-a1-1024x882.jpg",
            caption: "Secure your suite today.",
            cta: { label: "See Availability", href: "#availability" },
          },
        ],
      },
      {
        id: "story-inspo",
        title: "Design Inspo",
        coverImg:
          "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-d3.jpg",
        slides: [
          {
            img: "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-d3.jpg",
            caption: "Make your suite unmistakably you.",
          },
          {
            img: "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-a1-1024x882.jpg",
            caption: "The backdrop your brand deserves.",
          },
          {
            img: "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-d2.jpg",
            caption: "Claim the luxury design package.",
            cta: { label: "Claim Offer", href: TOUR_BOOKING_URL },
          },
        ],
      },
      {
        id: "story-perks",
        title: "Lease Perks",
        coverImg:
          "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-a1-1024x882.jpg",
        slides: [
          {
            img: "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-a1-1024x882.jpg",
            caption: "No revenue split. Keep what you earn.",
          },
          {
            img: "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-a3-1024x882.jpg",
            caption: "Your schedule. Your rules.",
          },
          {
            img: "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-d3.jpg",
            caption: "Talk through terms in 15 minutes.",
            cta: { label: "Schedule Call", href: CALL_BOOKING_URL },
          },
        ],
      },
    ],
    []
  );

  const CONTENT_PEOPLE: Person[] = useMemo(
    () => [
      {
        id: "p-naddy",
        name: "Naddy B",
        role: "Master Stylist",
        img: "https://i.pravatar.cc/100?img=32",
      },
      {
        id: "p-fely",
        name: "Fely C",
        role: "Lash Artist",
        img: "https://i.pravatar.cc/100?img=47",
      },
      {
        id: "p-ricky",
        name: "Ricky M",
        role: "Owner",
        img: "https://storage.googleapis.com/msgsndr/qhBbJtMZvmcd2J1AbrGG/media/691b84eb3f8277d9d7f282a9.png",
        badge: "Owner",
      },
      {
        id: "p-vera",
        name: "Vera H",
        role: "Brand Ambassador",
        img: "https://i.pravatar.cc/100?img=48",
        badge: "Ambassador",
      },
    ],
    []
  );

  const CONTENT_FEED: FeedPost[] = useMemo(
    () => [
      {
        id: "post-revenue-snapshot",
        img: "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-a1-1024x882.jpg",
        title: "Quick Revenue Snapshot",
        body: (
          <div className="space-y-4">
            <p className="text-sm">
              Fast math for beauty pros: what could you take home monthly?
            </p>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Weekly Rent ($)
              </label>
              <input
                type="number"
                value={calcWeeklyRent}
                onChange={(e) => setCalcWeeklyRent(Number(e.target.value))}
                className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Avg Weekly Revenue ($)
              </label>
              <input
                type="number"
                value={calcWeeklyRevenue}
                onChange={(e) => setCalcWeeklyRevenue(Number(e.target.value))}
                className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="bg-neutral-100 rounded-md p-4 text-center">
              <p className="text-xs text-neutral-600">
                Estimated Monthly Take-Home{" "}
                {applyPromo ? "(Year 1 w/ Promo)" : "(Standard)"}
              </p>
              <p className="text-xl font-semibold mt-1">
                ${estimatedMonthlyTakeHome.toLocaleString()}
              </p>

              {applyPromo && (
                <div className="mt-3 text-sm text-emerald-600 font-semibold">
                  +${monthlyDelta.toLocaleString()} / month
                  <div className="text-xs font-normal text-emerald-700">
                    ${annualDelta.toLocaleString()} first-year advantage
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setApplyPromo((p) => !p)}
              className={cx(
                "w-full text-xs font-semibold px-4 py-2 rounded-full border transition",
                applyPromo
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-emerald-600 border-emerald-500 hover:bg-emerald-50"
              )}
              type="button"
            >
              {applyPromo
                ? "✓ 8 Weeks Free Applied"
                : "Apply 8-Week Move-In Special"}
            </button>
          </div>
        ),
        primaryCta: {
          label: "Book Strategy Call",
          href: CALL_BOOKING_URL,
          variant: "green",
        },
        firstComment: {
          name: "Cosmo Leasing",
          text: "We’ll tailor pricing + suite options to your service mix.",
          ctaText: "Book a call.",
          ctaHref: CALL_BOOKING_URL,
        },
      },
      {
        id: "post-wb-offer",
        img: "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-a3-1024x882.jpg",
        title: "West Bloomfield Exclusive",
        body: (
          <>
            <strong>8 weeks FREE</strong> + a <strong>luxury design package</strong>{" "}
            when you secure your WB suite before <strong>March 1st, 2026</strong>.
            <span className="block mt-3 text-xs font-semibold text-neutral-800">
              Next Tour: <span className="text-black">Thursday 4:30 PM</span>
            </span>
            <span className="block text-xs font-semibold text-red-600">
              2 Spots Remaining
            </span>
          </>
        ),
        microUrgency: (
          <span className="block mt-2 text-xs font-semibold text-red-600">
            WB demand is high — limited promo suites
          </span>
        ),
        primaryCta: {
          label: "Book a Private Tour",
          href: TOUR_BOOKING_URL,
          variant: "gradient",
          isTour: true,
        },
        firstComment: {
          name: "Cosmo Leasing",
          text: "WB is elite — tours are the fastest path to a suite.",
          ctaText: "Book now.",
          ctaHref: TOUR_BOOKING_URL,
          isTour: true,
        },
      },
      {
        id: "post-freedom",
        img: "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-d3.jpg",
        title: "Freedom to Create",
        body: (
          <>
            Private studio. Your brand. Your rules. Raise prices without begging a
            salon owner.
          </>
        ),
        microUrgency: (
          <span className="block mt-2 text-xs font-semibold text-emerald-600">
            Tours booked today
          </span>
        ),
        primaryCta: {
          label: "Schedule a 15-Min Call",
          href: CALL_BOOKING_URL,
          variant: "black",
        },
        firstComment: {
          name: "Ricky M",
          text: "If you’re booked out, you’re ready for a suite.",
          ctaText: "Let’s run it.",
          ctaHref: CALL_BOOKING_URL,
        },
      },
      {
        id: "post-video",
        videoSrc: "https://media.publit.io/file/h_720/kvP02v5R.mp4",
        videoPoster:
          "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-a1-1024x882.jpg",
        title: "Quick Walkthrough",
        body: <>A reel-style peek at the vibe, the finishes, and the energy.</>,
        primaryCta: {
          label: "See Available Suites",
          href: "#availability",
          variant: "gradient",
        },
        firstComment: {
          name: "Vera H",
          text: "Your space sets the standard — clients feel it instantly.",
          ctaText: "See suites.",
          ctaHref: "#availability",
        },
      },
      {
        id: "post-growth",
        img: "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-d2.jpg",
        title: "Built for Growth",
        body: (
          <>
            No commission. No ceiling. Your suite is a client magnet — and you keep
            the upside.
          </>
        ),
        microUrgency: (
          <span className="block mt-2 text-xs font-semibold text-purple-600">
            Elite pros upgrade fast
          </span>
        ),
        primaryCta: {
          label: "Check Suite Availability",
          href: "#availability",
          variant: "green",
        },
        firstComment: {
          name: "Cosmo Studio Owner",
          text: "The suite makes selling high-ticket services easier.",
          ctaText: "Check availability.",
          ctaHref: "#availability",
        },
      },
      {
        id: "post-taylor",
        img: "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-d2.jpg",
        title: "Taylor Location Update",
        body: <>Taylor suites now open with limited founder incentives.</>,
        primaryCta: {
          label: "View Taylor Availability",
          href: "#availability",
          variant: "black",
        },
        firstComment: {
          name: "Ricky M",
          text: "Founders lock incentives first.",
          ctaText: "See options.",
          ctaHref: "#availability",
        },
      },
      {
        id: "post-annarbor",
        img: "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-d3.jpg",
        title: "Ann Arbor Pre-Leasing Now Live",
        body: <>Early access before public launch.</>,
        microUrgency: (
          <span className="block mt-2 text-xs font-semibold text-red-600">
            Waitlist moving daily
          </span>
        ),
        primaryCta: {
          label: "Join Ann Arbor Waitlist",
          href: "https://cosmoannarbor.com",
          variant: "green",
        },
        firstComment: {
          name: "Cosmo Leasing",
          text: "Ann Arbor interest is accelerating.",
          ctaText: "Join early.",
          ctaHref: "https://cosmoannarbor.com",
        },
      },
    ],
    [
      annualDelta,
      applyPromo,
      calcWeeklyRent,
      calcWeeklyRevenue,
      estimatedMonthlyTakeHome,
      monthlyDelta,
    ]
  );

  // =========================
  // EFFECTS
  // =========================

  useEffect(() => {
    const msgTimer = window.setTimeout(() => setHasNewMessage(true), 2500);

    

    
    

    return () => {
      window.clearTimeout(msgTimer);
      
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!openChat) {
      setShowChatSecondBubble(false);
      return;
    }
    const t = window.setTimeout(() => setShowChatSecondBubble(true), 1100);
    return () => window.clearTimeout(t);
  }, [openChat]);

  // =========================
  // STORY HELPERS
  // =========================

  const activeStory = activeStoryId
    ? CONTENT_STORIES.find((s) => s.id === activeStoryId) || null
    : null;

  const openStory = (storyId: string) => {
    setActiveStoryId(storyId);
    setStorySlideIndex(0);
  };

  const closeStory = () => {
    setActiveStoryId(null);
    setStorySlideIndex(0);
  };

  const nextStorySlide = () => {
    if (!activeStory) return;
    setStorySlideIndex((i) => Math.min(i + 1, activeStory.slides.length - 1));
  };

  const prevStorySlide = () => {
    if (!activeStory) return;
    setStorySlideIndex((i) => Math.max(i - 1, 0));
  };

  // =========================
  // COMPONENTS
  // =========================

  const TrustStats = () => (
    <div className="mt-8 w-full max-w-md mx-auto grid grid-cols-2 gap-4">
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-5 text-center">
        <p className="text-2xl font-semibold">376+</p>
        <p className="text-xs text-neutral-500 mt-1">Trusted by Pros</p>
      </div>
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-5 text-center">
        <p className="text-2xl font-semibold">4.9 ★</p>
        <p className="text-xs text-neutral-500 mt-1">Average Rating</p>
      </div>
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-5 text-center col-span-2">
        <p className="text-sm font-semibold">Serving Metro Detroit’s Beauty Community</p>
        <p className="text-xs text-neutral-500 mt-1">
          Professionally managed • Transparent lease terms
        </p>
      </div>
    </div>
  );

  const Header = () => (
    <div className="fixed top-0 left-0 w-full bg-white border-b border-neutral-200 z-50">
      <div className="max-w-md mx-auto h-14 flex items-center justify-center">
        <img
          src="https://cosmosalonstudios.com/wp-content/uploads/2021/06/cosmo-logo.svg"
          alt="Cosmo Logo"
          className="h-8 w-auto"
        />
      </div>
    </div>
  );

  const PrimaryButton = ({
    href,
    label,
    variant,
    isTour,
  }: {
    href: string;
    label: string;
    variant: FeedPost["primaryCta"]["variant"];
    isTour?: boolean;
  }) => {
    const base =
      "block w-full text-center text-sm font-semibold px-5 py-3 rounded-md shadow-sm active:scale-[0.98] transition";

    const styles = {
      gradient:
        "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90",
      black: "bg-black text-white hover:bg-neutral-900",
      green:
        "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:opacity-90",
      white: "bg-white text-black hover:bg-neutral-100",
    } as const;

    const clickHandler = isTour
      ? (e: React.MouseEvent<HTMLAnchorElement>) => openBookingPreferC(e)
      : undefined;

    // Always set href for accessibility / long-press / copy-link.
    // For tour links, desktop click will be intercepted to open new tab.
    return (
      <a href={href} onClick={clickHandler} className={cx(base, styles[variant])}>
        {label}
      </a>
    );
  };

  const FirstComment = ({
    name,
    text,
    ctaText,
    ctaHref,
    isTour,
  }: {
    name: string;
    text: string;
    ctaText?: string;
    ctaHref?: string;
    isTour?: boolean;
  }) => (
    <div className="px-6 pb-4">
      <p className="text-xs text-neutral-500">
        <span className="font-semibold text-neutral-800 mr-1">{name}</span>
        {text}{" "}
        {ctaText && (
          <a
            href={ctaHref || "#"}
            onClick={isTour ? (e) => openBookingPreferC(e) : undefined}
            className="font-semibold text-blue-600 hover:underline"
          >
            {ctaText}
          </a>
        )}
      </p>
    </div>
  );

  const SavePostButton = ({ postId }: { postId: string }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleSave(postId);
      }}
      className="absolute top-3 right-3 z-10 bg-white/90  rounded-full p-2 shadow-md border border-neutral-200 text-lg hover:scale-105 active:scale-95 transition"
      aria-label="Save post"
      title="Save"
      type="button"
    >
      {savedPosts.includes(postId) ? "🔖" : "📑"}
    </button>
  );

  const FeedCard = ({ post }: { post: FeedPost }) => {
    const isLiked = likedPosts.includes(post.id);
    const showBurst = likeBurstPostId === post.id;

    return (
      <div className="relative mt-8 w-full max-w-md mx-auto bg-white border border-neutral-200 rounded-xl shadow-md overflow-hidden">
        <SavePostButton postId={post.id} />

        <div className="relative" onClick={() => toggleLike(post.id)} role="button" tabIndex={0}>
          {post.videoSrc ? (
            <div className="bg-black">
              <video
                playsInline
                muted
                
                
                controls
                className="w-full"
                poster={post.videoPoster}
              >
                <source src={post.videoSrc} type="video/mp4" />
              </video>
            </div>
          ) : (
            post.img && (
              <img
                src={post.img}
                alt={post.title}
                className="w-full h-auto object-cover cursor-pointer"
              />
            )
          )}

          {(showBurst || isLiked) && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className={cx("text-6xl", showBurst ? "" : "opacity-0")}>
                ❤️
              </span>
            </div>
          )}
        </div>

        <div className="p-6 text-left">
          <p className="text-neutral-800 mb-4 text-base leading-relaxed">
            <span className="mr-1">{emojiForTitle(post.title)}</span>
            <strong>{post.title}:</strong>
            <br />
            {post.body}
            {post.microUrgency}
          </p>

          <PrimaryButton
            href={post.primaryCta.href}
            label={post.primaryCta.label}
            variant={post.primaryCta.variant}
            isTour={post.primaryCta.isTour}
          />
        </div>

        <FirstComment
          name={post.firstComment.name}
          text={post.firstComment.text}
          ctaText={post.firstComment.ctaText}
          ctaHref={post.firstComment.ctaHref}
          isTour={post.firstComment.isTour}
        />
      </div>
    );
  };

  const StoriesRow = () => (
    <div className="mt-6 w-full max-w-md mx-auto overflow-x-auto">
      <div className="flex gap-4 pb-2">
        {CONTENT_STORIES.map((story) => (
          <div
            key={story.id}
            onClick={() => openStory(story.id)}
            className="flex flex-col items-center min-w-[72px] cursor-pointer"
            role="button"
            tabIndex={0}
          >
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-400">
              <div
                className="w-full h-full rounded-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${story.coverImg})` }}
              >
                <div className="absolute inset-0 rounded-full bg-black/25" />
              </div>
            </div>
            <span className="text-[11px] text-neutral-700 mt-2 text-center leading-tight">
              {story.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const PeopleYouMayKnow = () => (
    <div className="mt-10 w-full max-w-md mx-auto bg-white border border-neutral-200 rounded-xl shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-neutral-700 tracking-wide">
          People You May Know
        </h3>
        <span className="block text-xs text-neutral-500 mt-1">
          4 members recently joined Cosmo WB
        </span>
      </div>
      <div className="space-y-4">
        {CONTENT_PEOPLE.map((p) => (
          <div key={p.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={p.img} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold">{p.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-neutral-500">{p.role}</p>
                  {p.badge && (
                    <span className="text-[10px] font-semibold px-2 py-[2px] rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                      {p.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button className="text-xs text-blue-600 font-semibold" type="button">
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const FinalCta = () => (
    <div
      id="tour"
      className="mt-20 w-full max-w-md mx-auto bg-black text-white text-center rounded-xl py-16 px-8 shadow-2xl border border-neutral-800"
    >
      <h2 className="text-3xl md:text-4xl font-light leading-snug mb-4 tracking-tight">
        Elevate the Way You Work
      </h2>
      <p className="text-lg leading-relaxed mb-8 text-neutral-300">Elite. Independent. In demand.</p>

      {/* Identity Toggle */}
      <div className="mb-6 space-y-3">
        <button
          onClick={() => setIdentityChoice("booth")}
          className={cx(
            "w-full text-sm font-semibold px-5 py-3 rounded-md border transition",
            identityChoice === "booth"
              ? "bg-white text-black border-white"
              : "bg-transparent text-white border-neutral-600 hover:border-white"
          )}
          type="button"
        >
          I’m Currently Booth Renting
        </button>
        <button
          onClick={() => setIdentityChoice("owner")}
          className={cx(
            "w-full text-sm font-semibold px-5 py-3 rounded-md border transition",
            identityChoice === "owner"
              ? "bg-white text-black border-white"
              : "bg-transparent text-white border-neutral-600 hover:border-white"
          )}
          type="button"
        >
          I Already Own My Clients
        </button>
      </div>

      <a
        href={TOUR_BOOKING_URL}
        onClick={(e) => openBookingPreferC(e)}
        className="block w-full max-w-xs mx-auto bg-white text-black text-sm font-semibold px-7 py-3 rounded-md shadow-sm hover:bg-neutral-100 active:scale-[0.98] transition"
      >
        Book a Private Tour
      </a>

      <div id="availability" className="mt-6 text-xs text-neutral-400">
        Tip: Tap “See Availability” in any post to review open suites.
      </div>
    </div>
  );

  

  const MessageFab = () => (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => {
          setOpenChat(true);
          setHasNewMessage(false);
        }}
        className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition"
        aria-label="Open messages"
        type="button"
      >
        💬
        {hasNewMessage && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
            1
          </span>
        )}
      </button>
    </div>
  );

  const MessageModal = () =>
    openChat ? (
      <div className="fixed inset-0 bg-black/40 z-[60] flex items-end sm:items-center justify-center">
        <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-neutral-100 px-4 py-3 flex justify-between items-center border-b">
            <span className="text-sm font-semibold">Cosmo Leasing</span>
            <button
              onClick={() => setOpenChat(false)}
              className="text-xs text-blue-600 font-semibold"
              aria-label="Close messages"
              type="button"
            >
              Close
            </button>
          </div>

          <div className="p-4 space-y-3 bg-neutral-50 min-h-[240px]">
            <div className="bg-white px-4 py-2 rounded-2xl text-sm shadow-sm w-fit max-w-[80%]">
              Hi 👋 A West Bloomfield suite just opened up.
            </div>
            {showChatSecondBubble && (
              <div className="bg-white px-4 py-2 rounded-2xl text-sm shadow-sm w-fit max-w-[80%]">
                Want first access before it’s publicly listed?
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-white">
            <a
              href={TOUR_BOOKING_URL}
              onClick={(e) => openBookingPreferC(e)}
              className="block w-full text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-sm"
            >
              Yes — Show Me the Suite
            </a>
          </div>
        </div>
      </div>
    ) : null;

  const StoryModal = () => {
    if (!activeStory) return null;
    const slide = activeStory.slides[storySlideIndex];
    const progressPct = ((storySlideIndex + 1) / activeStory.slides.length) * 100;

    const isTourStoryCta = !!slide.cta && slide.cta.href === TOUR_BOOKING_URL;

    return (
      <div className="fixed inset-0 bg-black z-[80] flex items-center justify-center">
        <div className="relative w-full max-w-md h-[85vh] bg-black rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full p-4">
            <div className="h-[3px] w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          <img src={slide.img} alt="Story" className="w-full h-full object-cover" />

          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
            <p className="text-sm mb-4">{slide.caption}</p>
            {slide.cta && (
              <a
                href={slide.cta.href}
                onClick={(e) => {
                  if (isTourStoryCta) openBookingPreferC(e);
                  closeStory();
                }}
                className="block w-full text-center bg-white text-black text-sm font-semibold px-5 py-3 rounded-full"
              >
                {slide.cta.label}
              </a>
            )}
          </div>

          <button
            onClick={prevStorySlide}
            className="absolute inset-y-0 left-0 w-1/2"
            aria-label="Previous slide"
            type="button"
          />
          <button
            onClick={nextStorySlide}
            className="absolute inset-y-0 right-0 w-1/2"
            aria-label="Next slide"
            type="button"
          />

          <button
            onClick={closeStory}
            className="absolute top-4 right-4 text-white text-sm bg-black/40 px-3 py-1 rounded-full"
            aria-label="Close story"
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans overflow-x-hidden ">
      {/* SECTION: header */}
      <Header />

      {/* SECTION: main */}
      <main className="pt-20 pb-28 px-6 flex flex-col items-center" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* SECTION: stories */}
        <StoriesRow />

        {/* SECTION: trust */}
        <TrustStats />

        {/* SECTION: live activity */}
        <LiveActivityBar />

        {/* SECTION: feed */}
        {CONTENT_FEED.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}

        {/* SECTION: people */}
        <PeopleYouMayKnow />

        {/* SECTION: final */}
        <FinalCta />
      </main>

      {/* SECTION: overlays */}
      
      <MessageFab />
      <MessageModal />
      <StoryModal />

      {/* SECTION: toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-4 py-2 rounded-full shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}

export function emojiForTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("west bloomfield")) return "🎉";
  if (t.includes("freedom")) return "✂️";
  if (t.includes("walkthrough") || t.includes("reel") || t.includes("quick")) return "🎬";
  if (t.includes("growth")) return "🚀";
  if (t.includes("taylor")) return "💰";
  if (t.includes("ann arbor")) return "⏳";
  if (t.includes("revenue snapshot") || t.includes("revenue")) return "🧾";
  return "📌";
}

// =========================
// TESTS (pure functions)
// =========================

export function __test__emojiForTitle(): boolean {
  const cases: Array<[string, string]> = [
    ["West Bloomfield Exclusive", "🎉"],
    ["Freedom to Create", "✂️"],
    ["Quick Walkthrough", "🎬"],
    ["Built for Growth", "🚀"],
    ["Taylor Location Update", "💰"],
    ["Ann Arbor Pre-Leasing Now Live", "⏳"],
    ["Quick Revenue Snapshot", "🧾"],
    ["Something Else", "📌"],
  ];

  return cases.every(([title, expected]) => emojiForTitle(title) === expected);
}

export function __test__shouldOpenBookingInNewTab(): boolean {
  const cases: Array<[number, boolean]> = [
    [0, false],
    [375, false],
    [767, false],
    [768, true],
    [1024, true],
  ];
  return cases.every(([w, expected]) => shouldOpenBookingInNewTab(w) === expected);
}

export function __test__shouldOpenBookingInNewTab_strictEdges(): boolean {
  return (
    shouldOpenBookingInNewTab(DESKTOP_BREAKPOINT_PX - 1) === false &&
    shouldOpenBookingInNewTab(DESKTOP_BREAKPOINT_PX) === true
  );
}
