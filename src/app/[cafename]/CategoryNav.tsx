"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type CategoryLink = {
  id: string;
  name: string;
};

interface CategoryNavProps {
  categories: CategoryLink[];
}

export default function CategoryNav({ categories }: CategoryNavProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  //const sectionIds = useMemo(() => categories.map((c) => `cat-${c.id}`), [categories]);
  let sectionIds;
  useEffect(() => {
    sectionIds = categories.map((c) => `cat-${c.id}`);

    if (sectionIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the top-most visible section as active
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top || 0) - (b.boundingClientRect.top || 0));
        if (visible.length > 0) {
          const id = visible[0].target.id.replace("cat-", "");
          setActiveCategoryId(id);
        }
      },
      {
        // Bias toward sections near the top of viewport
        root: null,
        rootMargin: "-35% 0px -60% 0px",
        threshold: 0.1,
      }
    );

    const elements: Element[] = [];
    for (const sectionId of sectionIds) {
      const el = document.getElementById(sectionId);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    }

    return () => {
      for (const el of elements) observer.unobserve(el);
      observer.disconnect();
    };
  }, [sectionIds]);

  const handleClick = (id: string) => {
    const section = document.getElementById(`cat-${id}`);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    // Keep URL in sync without jumping
    try {
      history.replaceState(null, "", `#cat-${id}`);
    } catch {}
    setActiveCategoryId(id);
    // Ensure the active chip is scrolled into view if overflowed
    const container = containerRef.current;
    const chip = document.getElementById(`cat-chip-${id}`);
    if (container && chip) {
      const containerRect = container.getBoundingClientRect();
      const chipRect = chip.getBoundingClientRect();
      if (chipRect.left < containerRect.left || chipRect.right > containerRect.right) {
        container.scrollTo({
          left: chip.offsetLeft - containerRect.width / 2 + chipRect.width / 2,
          behavior: "smooth",
        });
      }
    }
  };

  if (!categories || categories.length === 0) return null;

  return (
    <div className="sticky top-0 z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div
        ref={containerRef}
        className="container mx-auto max-w-5xl px-4 py-3 overflow-x-auto scrollbar-none"
      >
        <div className="flex gap-2 min-w-max">
          {categories.map((c) => {
            const isActive = activeCategoryId === c.id;
            return (
              <button
                key={c.id}
                id={`cat-chip-${c.id}`}
                type="button"
                onClick={() => handleClick(c.id)}
                className={
                  "whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition-colors " +
                  (isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/40 text-foreground hover:bg-muted border-transparent")
                }
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}


