"use client";

import { useRouter } from "next/navigation";
import { ParticleHero } from "@/components/ui/animated-hero";
import { Features }     from "@/components/marketing/Features";
import { SocialProof }  from "@/components/marketing/SocialProof";
import { Pricing }      from "@/components/marketing/Pricing";
import { FAQ }          from "@/components/marketing/FAQ";
import { Footer }       from "@/components/marketing/Footer";

export default function HomePage() {
  const router = useRouter();

  return (
    <main>
      <ParticleHero
        title="SNIP"
        subtitle="Link Intelligence"
        description="Turn long URLs into sharp, trackable links — with real-time analytics on clicks, referrers, and geography."
        particleCount={15}
        interactiveHint="Move to interact"
        primaryButton={{
          text: "Start shortening free",
          onClick: () => router.push("/register"),
        }}
        secondaryButton={{
          text: "See how it works →",
          onClick: () => {
            document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
          },
        }}
      />

      <Features />
      <SocialProof />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
