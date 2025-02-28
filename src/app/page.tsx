/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ArrowRight, Check, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Phone from "@/components/Phone";
import Reviews from "@/components/Reviews";
import { features, reviews, users } from "./constants";
// import { Icons } from "@/components/Icons";

const UserAvatars: React.FC = () => (
  <div className="flex -space-x-4">
    {users.map((src, index) => (
      <img
        key={index}
        className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100 object-cover"
        src={src}
        alt="user image"
      />
    ))}
  </div>
);

const StarRating: React.FC<{ stars: number }> = ({ stars }) => (
  <div className="flex gap-0.5">
    {[...Array(stars)].map((_, index) => (
      <Star key={index} className="h-4 w-4 text-green-600 fill-green-600" />
    ))}
  </div>
);

const CustomerStats: React.FC = () => (
  <div className="mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-5">
    <UserAvatars />
    <div className="flex flex-col justify-between items-center sm:items-start">
      <StarRating stars={5} />
      <p>
        <span className="font-semibold">1,250</span> happy customers
      </p>
    </div>
  </div>
);

interface FeatureListProps {
  features: string[];
}

const FeatureList: React.FC<FeatureListProps> = ({ features }) => (
  <ul className="mt-8 space-y-2 text-left font-medium flex flex-col items-center sm:items-start">
    {features.map((feature, index) => (
      <li key={index} className="flex gap-1.5 items-center text-left">
        <Check className="h-5 w-5 shrink-0 text-green-600" />
        {feature}
      </li>
    ))}
  </ul>
);

interface CustomerReviewProps {
  name: string;
  imgSrc: string;
  review: string;
}

const CustomerReview: React.FC<CustomerReviewProps> = ({
  name,
  imgSrc,
  review,
}) => (
  <div className="flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20">
    <div className="flex gap-0.5 mb-2">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="h-5 w-5 text-green-600 fill-green-600" />
      ))}
    </div>
    <p className="text-lg leading-8">{review}</p>
    <div className="flex gap-4 mt-2">
      <img
        className="rounded-full h-12 w-12 object-cover"
        src={imgSrc}
        alt={name}
      />
      <div className="flex flex-col">
        <p className="font-semibold">{name}</p>
        <div className="flex gap-1.5 items-center text-zinc-600">
          <Check className="h-4 w-4 stroke-[3px] text-green-600" />
          <p className="text-sm">Verified Purchase</p>
        </div>
      </div>
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="bg-slate-50 grainy-light">
      <section>
        <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-cols-3 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 xl:pt-32 lg:pb-52">
          <div className="col-span-2 px-6 lg:px-0 lg:pt-4">
            <h1 className="text-center lg:text-left text-5xl font-bold text-gray-900">
              Your Image on a{" "}
              <span className="bg-green-600 rounded-md px-2 text-white">
                Custom
              </span>{" "}
              Phone Case
            </h1>
            <p className="mt-8 text-lg text-center lg:text-left">
              Capture your favorite memories with a one-of-one phone case.
              Protect your memories, not just your phone.
            </p>
            <FeatureList features={features} />

            <CustomerStats />
          </div>
          <div className="col-span-1 flex justify-center mt-32 lg:mt-20">
            <Phone className="w-64" imgSrc="/testimonials/11.jpg" />
          </div>
        </MaxWidthWrapper>
      </section>

      <section className="bg-slate-100 grainy-dark py-24">
        <MaxWidthWrapper className="flex flex-col items-center gap-16">
          <h2 className="text-center text-5xl font-bold text-gray-900">
            What our customers say
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-16">
            {reviews.map((review, index) => (
              <CustomerReview key={index} {...review} />
            ))}
          </div>
          <Reviews />
        </MaxWidthWrapper>
      </section>

      <section>
        <MaxWidthWrapper className="py-24 text-center">
          <div className="mb-12 px-6 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center">
              <h2 className="order-1 mt-2 tracking-tight text-center text-balance !leading-tight font-bold text-5xl md:text-6xl text-gray-900">
                Upload your photo and get{" "}
                <span className="relative px-2 rounded-md bg-green-600 text-white">
                  your own case
                </span>{" "}
                now
              </h2>
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="relative flex flex-col items-center md:grid grid-cols-2 gap-40">
              <img
                src="/arrow.png"
                className="absolute top-[25rem] md:top-1/2 -translate-y-1/2 z-10 left-1/2 -translate-x-1/2 rotate-90 md:rotate-0"
              />

              <div className="relative h-80 md:h-full w-full md:justify-self-end max-w-sm rounded-xl bg-gray-900/5 ring-inset ring-gray-900/10 lg:rounded-2xl">
                <img
                  src="/testimonials/10.jpg"
                  className="rounded-md object-cover bg-white shadow-2xl ring-1 ring-gray-900/10 h-full w-full"
                />
              </div>

              <Phone className="w-60" imgSrc="/testimonials/10.jpg" />
            </div>
            <FeatureList features={features} />
          </div>

          <Link
            className={buttonVariants({
              size: "lg",
              className: "mx-auto mt-8",
            })}
            href="/configure/upload"
          >
            Create your case now <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
