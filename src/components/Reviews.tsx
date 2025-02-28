/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

"use client";
import React, { useEffect, useRef, useState } from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import Phone from "./Phone";

const PHONES = [
  "/testimonials/7.jpg",
  "/testimonials/8.jpg",
  "/testimonials/9.jpg",
  "/testimonials/10.jpg",
  "/testimonials/11.jpg",
  "/testimonials/12.jpg",
];

interface ReviewProps extends React.HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
  className: string | undefined;
}

function Review({ imgSrc, className, ...props }: ReviewProps) {
  const POSSIBLE_ANIMATION_DELAYS = [
    "0s",
    "0.1s",
    "0.2s",
    "0.3s",
    "0.4s",
    "0.5s",
  ];

  const animationDelay =
    POSSIBLE_ANIMATION_DELAYS[
      Math.floor(Math.random() * POSSIBLE_ANIMATION_DELAYS.length)
    ];
  return (
    <div
      className={cn(
        "animate-fade-in rounded-[2.25rem] bg-white p-6 opacity-0 shadow-xl shadow-slate-900/5",
        className
      )}
      style={{ animationDelay }}
      {...props}
    >
      <Phone imgSrc={imgSrc} />
    </div>
  );
}

function ReviewColumn({
  reviews,
  className,
  reviewClassName,
  msPerPixel = 0,
}: {
  reviews: string[];
  className?: string;
  reviewClassName?: (reviewIndex: number) => string;
  msPerPixel?: number;
}) {
  console.log("reviews", reviews);
  const columnRef = useRef<HTMLDivElement>(null);
  const [columnHeight, setColumnHeight] = useState(0);
  const duration = `${columnHeight * msPerPixel}ms`;

  useEffect(() => {
    if (!columnRef?.current) return;
    const resizeObserver = new window.ResizeObserver(() => {
      setColumnHeight(columnRef.current?.offsetHeight || 0);
    });
    resizeObserver.observe(columnRef?.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={columnRef}
      className={cn("animate-marquee space-y-8 py-4", className)}
      style={{ "--marquee-duration": duration } as React.CSSProperties}
    >
      {reviews.map((imgSrc, reviewIndex) => (
        <Review
          key={reviewIndex}
          imgSrc={imgSrc}
          className={reviewClassName?.(reviewIndex)}
        />
      ))}
    </div>
  );
}

function splitArray<T>(array: Array<T>, numParts: number) {
  const result: Array<Array<T>> = [];

  for (let i = 0; i < array.length; i++) {
    const index = i % numParts;
    if (!result[index]) {
      result[index] = [];
    }

    result[index].push(array[i]);
  }

  return result;
}

function ReviewsGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });
  const columns = splitArray(PHONES, 3);
  const column1 = columns[0];
  const column2 = columns[1];
  const column3 = columns[2];

  return (
    <div
      ref={containerRef}
      className="relative -mx-4 mt-16 grid items-start overflow-hidden sm:mt-20  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-[49rem] max-h-[150vh]
    px-4
    "
    >
      {isInView ? (
        <>
          <ReviewColumn
            reviews={[...column1, ...column2, ...column3]}
            reviewClassName={(reviewIndex) =>
              cn({
                "lg:hidden": reviewIndex >= column1.length,
                "md:hidden": reviewIndex >= column1.length + column2.length - 1,
              })
            }
            msPerPixel={10}
          />
          <ReviewColumn
            reviews={[...column2, ...column3]}
            reviewClassName={(reviewIndex) =>
              cn({
                "lg:hidden": reviewIndex >= column2.length,
                "md:hidden": reviewIndex >= column2.length + column3.length,
              })
            }
            msPerPixel={15}
          />
          <ReviewColumn reviews={[...column3]} msPerPixel={10} />
        </>
      ) : null}
    </div>
  );
}

const Reviews = () => {
  return (
    <MaxWidthWrapper className="relative max-w-5xl ">
      <ReviewsGrid />
    </MaxWidthWrapper>
  );
};

export default Reviews;
