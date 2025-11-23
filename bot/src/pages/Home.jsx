'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { InteractiveImage } from '@/components/interactive-image';
import { ImageGallery } from '@/components/image-gallery';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const assetPaths = {
    hero: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80',
    mindfulness: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1000&q=80',
    breathing: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80',
    yoga: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    journaling: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80',
  };

  const wellnessImages = [
    {
      id: '1',
      src: assetPaths.mindfulness,
      alt: 'Mindfulness meditation session',
      title: 'Mindfulness Meditation',
    },
    {
      id: '2',
      src: assetPaths.breathing,
      alt: 'Breathing exercises for relaxation',
      title: 'Breathing Techniques',
    },
    {
      id: '3',
      src: assetPaths.yoga,
      alt: 'Yoga practice for mental health',
      title: 'Yoga & Stretching',
    },
    {
      id: '4',
      src: assetPaths.journaling,
      alt: 'Journaling for emotional wellness',
      title: 'Journaling',
    },
  ];

  const spotlightPractices = [
    {
      id: 'breath',
      src: assetPaths.breathing,
      alt: 'Guided breathing exercise',
      title: 'Guided Breathing',
      description: 'Sync your breath with calming visual cues to regulate emotions.'
    },
    {
      id: 'journal',
      src: assetPaths.journaling,
      alt: 'Mindful journaling',
      title: 'Reflective Journaling',
      description: 'Capture thoughts in a structured space supported by AI prompts.'
    },
    {
      id: 'movement',
      src: assetPaths.yoga,
      alt: 'Mindful movement practice',
      title: 'Mindful Movement',
      description: 'Gentle stretches paired with affirmations to reset your day.'
    }
  ];

  const immersiveHighlights = [
    {
      id: 'restorative_yoga',
      src: assetPaths.yoga,
      alt: 'Restorative yoga pose',
      title: 'Restorative Yoga Flow',
      caption: 'Follow guided stretches with adaptive breath cues.'
    },
    {
      id: 'calm_presence',
      src: assetPaths.hero,
      alt: 'Person enjoying calm moment',
      title: 'Calm Presence Check-in',
      caption: 'A gentle prompt sequence to ground your day.'
    }
  ];

  const heroStats = [
    { label: 'Daily Sessions', value: '12K+' },
    { label: 'Mood Check-ins', value: '85%' },
    { label: 'User Satisfaction', value: '4.9/5' }
  ];

  const containerClass = 'mx-auto w-full  px-4 sm:px-6 lg:px-8';

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className={`${containerClass} py-4 flex justify-between items-center`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:inline">MIND</span>
          </div>
          <div className="hidden sm:flex gap-4 items-center">
            <Button asChild variant="ghost" className="text-foreground">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
          <button className="sm:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-border p-4 bg-card space-y-3">
            <Button asChild variant="ghost" className="w-full justify-start text-foreground">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-20 bg-card border-b border-border">
          <div className={`${containerClass} grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                AI-Powered Mental Health
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
                Your Mental Wellness <span className="text-primary">Companion</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Experience empathetic, AI-driven mental health support available 24/7. MIND combines advanced technology with compassionate design to provide personalized emotional support when you need it most.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-2">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="p-4 rounded-lg border border-border bg-background text-center">
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-5 text-base h-auto">
                  <Link to="/signup">Start Your Journey</Link>
                </Button>
                <Button asChild variant="outline" className="text-primary border-primary hover:bg-primary/10 px-8 py-5 text-base h-auto">
                  <Link to="/login">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center items-center mt-10 lg:mt-0">
              <InteractiveImage
                src={assetPaths.hero}
                alt="Mental wellness support"
                title="Calm, Supportive, Always Here"
                width="100%"
                height={360}
              />
            </div>
          </div>
        </section>

        {/* Spotlight Section */}
        <section className="px-6 py-20 bg-background border-b border-border">
          <div className={containerClass}>
            <div className="flex flex-col lg:flex-row justify-between gap-8 mb-12">
              <div>
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                  Guided Experiences
                </span>
                <h2 className="text-4xl font-bold mb-3">Interactive Support Moments</h2>
                <p className="text-lg text-muted-foreground">
                  Engage with immersive micro-practices designed by therapists and enhanced by our Interactive Image components.
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <Button variant="outline" className="border-border text-foreground hover:bg-card">
                  Preview Session
                </Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Launch App
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {spotlightPractices.map((practice) => (
                <div key={practice.id} className="space-y-4">
                  <InteractiveImage
                    src={practice.src}
                    alt={practice.alt}
                    title={practice.title}
                    width="100%"
                    height={360}
                  />
                  <p className="text-muted-foreground">{practice.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-20 bg-background">
          <div className={containerClass}>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Why Choose MIND?
              </span>
              <h2 className="text-4xl font-bold">Gentle Support for Your Mental Wellbeing</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Empathetic Interaction",
                  description: "Advanced emotion detection and sentiment analysis for personalized support",
                  icon: "🤝"
                },
                {
                  title: "24/7 Availability",
                  description: "Access support anytime, anywhere through our web-based platform",
                  icon: "⏰"
                },
                {
                  title: "Privacy Focused",
                  description: "Secure, anonymous conversations through encrypted channels",
                  icon: "🔒"
                },
                {
                  title: "Self-Help Resources",
                  description: "Access to mindfulness, breathing exercises, and emotional resilience techniques",
                  icon: "📚"
                },
                {
                  title: "Real-Time Support",
                  description: "Immediate responses and adaptive conversation based on your needs",
                  icon: "💭"
                },
                {
                  title: "Professional Insights",
                  description: "Optional progress tracking for healthcare professionals",
                  icon: "📊"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 flex flex-col items-start"
                >
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 bg-card border-y border-border">
          <div className={`${containerClass} grid grid-cols-1 lg:grid-cols-5 gap-12 items-center`}>
            <div className="lg:col-span-2 space-y-6">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Wellness Techniques
              </span>
              <h2 className="text-4xl font-bold">Explore Mindful Practices</h2>
              <p className="text-lg text-muted-foreground">
                Browse curated exercises, rituals, and guided sessions that adapt to your emotional state. The gallery updates in real-time based on trending needs across the community.
              </p>
              <Button variant="outline" className="border-border text-foreground hover:bg-background">
                View All Practices
              </Button>
            </div>
            <div className="lg:col-span-3">
              <ImageGallery images={wellnessImages} />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="px-6 py-20 bg-card border-t border-border">
          <div className={containerClass}>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                What Our Users Say
              </span>
              <h2 className="text-4xl font-bold mb-2">Real Stories. Real Impact.</h2>
              <p className="text-lg text-muted-foreground">See how MIND is making a difference in people's lives every day.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  quote: "MIND has been a game-changer for my anxiety. The calming interface and thoughtful responses make me feel understood.",
                  author: "Sarah J.",
                  role: "Graphic Designer"
                },
                {
                  quote: "As someone who struggles to open up, the anonymity of MIND helped me express myself freely without judgment.",
                  author: "Michael T.",
                  role: "University Student"
                }
              ].map((testimonial, index) => (
                <div key={index} className="p-8 rounded-xl bg-background border border-border hover:border-primary/50 transition-all flex flex-col">
                  <p className="text-lg text-foreground mb-6 font-medium italic">{`"${testimonial.quote}"`}</p>
                  <div className="mt-auto">
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {/* Immersive Highlight Section */}
        <section className="px-6 py-20 bg-background border-t border-border">
          <div className={`${containerClass} space-y-10`}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                  Public Library Preview
                </span>
                <h2 className="text-4xl font-bold mb-3">Straight From Our Media Vault</h2>
                <p className="text-lg text-muted-foreground">
                  Every scene below lives inside the `public` folder, giving you production-ready assets without external dependencies.
                </p>
              </div>
              <Button variant="outline" className="h-auto px-6 py-3 text-sm border-border text-foreground hover:bg-card">
                Browse Public Assets
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {immersiveHighlights.map((highlight) => (
                <div key={highlight.id} className="space-y-4">
                  <InteractiveImage
                    src={highlight.src}
                    alt={highlight.alt}
                    title={highlight.title}
                    width="100%"
                    height={360}
                  />
                  <p className="text-muted-foreground">{highlight.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="px-6 py-20 bg-card border-t border-border">
          <div className={`${containerClass} text-center space-y-6`}>
            <h2 className="text-4xl font-bold text-foreground">Ready to Start Your Wellness Journey?</h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of others who rely on MIND for daily check-ins, coping techniques, and calming support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-5 text-base h-auto font-semibold">
                <Link to="/signup">Get Started Now</Link>
              </Button>
              <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 px-8 py-5 text-base h-auto font-semibold">
                <Link to="/login">Talk to MIND</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary/5 text-foreground pt-16 pb-8 border-t border-border">
        <div className={containerClass}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div>
              <h4 className="font-bold text-xl mb-4 text-foreground">MIND</h4>
              <p className="text-muted-foreground mb-6">Mental Intelligence for Nurturing Dialogue</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-foreground">Resources</h5>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li className="hover:text-foreground cursor-pointer transition">Documentation</li>
                <li className="hover:text-foreground cursor-pointer transition">Support</li>
                <li className="hover:text-foreground cursor-pointer transition">Privacy Policy</li>
                <li className="hover:text-foreground cursor-pointer transition">Terms of Service</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-foreground">Company</h5>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li className="hover:text-foreground cursor-pointer transition">About Us</li>
                <li className="hover:text-foreground cursor-pointer transition">Contact</li>
                <li className="hover:text-foreground cursor-pointer transition">Careers</li>
                <li className="hover:text-foreground cursor-pointer transition">Blog</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-foreground">Get Help</h5>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li className="hover:text-foreground cursor-pointer transition">Crisis Resources</li>
                <li className="hover:text-foreground cursor-pointer transition">FAQ</li>
                <li className="hover:text-foreground cursor-pointer transition">Community</li>
                <li className="hover:text-foreground cursor-pointer transition">Feedback</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} MIND Project — COMSATS University, Abbottabad Campus. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
