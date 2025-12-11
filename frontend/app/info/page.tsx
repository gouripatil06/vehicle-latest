"use client"

import { Header } from "@/components/layout/header"
import { InfoHeroSection } from "@/components/info/info-hero-section"
import { WhySimulatorSection } from "@/components/info/why-simulator-section"
import { WhatSimulatorDoesSection } from "@/components/info/what-simulator-does-section"
import { SystemArchitectureSection } from "@/components/info/system-architecture-section"
import { TechStackSection } from "@/components/info/tech-stack-section"
import { KeyFeaturesSection } from "@/components/info/key-features-section"
import { InfoCTASection } from "@/components/info/info-cta-section"

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <InfoHeroSection />
        <WhySimulatorSection />
        <WhatSimulatorDoesSection />
        <SystemArchitectureSection />
        <TechStackSection />
        <KeyFeaturesSection />
        <InfoCTASection />
      </div>
    </div>
  )
}

