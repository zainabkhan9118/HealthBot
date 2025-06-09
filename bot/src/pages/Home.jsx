import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';


export default function HomePage() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen bg-[#E6E6FA]/10 text-gray-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#E6E6FA]/50 p-6 flex justify-between items-center fixed w-full z-50">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#9B7EDC] to-[#E6E6FA] bg-clip-text text-transparent">
            MIND
          </h1>
          <span className="text-sm text-[#9B7EDC] hidden sm:inline">Mental Intelligence for Nurturing Dialogue</span>
        </div>
        <div className="space-x-4">
          <Button 
            variant="ghost" 
            className="text-[#9B7EDC] hover:text-[#8B6AD1] hover:bg-[#E6E6FA]/50"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
          <Button 
            className="bg-[#9B7EDC] hover:bg-[#8B6AD1] text-white shadow-lg shadow-[#E6E6FA] hover:shadow-[#D8D8FF] transition-all"
            onClick={() => navigate('/signup')}
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24">
        <section className="px-6 py-16 bg-gradient-to-b from-[#E6E6FA]/30 to-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
                Your Mental Wellness
                <span className="block text-[#9B7EDC]">Companion</span>
              </h2>
              <p className="text-lg text-[#9B7EDC]/90">
                Experience empathetic, AI-driven mental health support available 24/7. 
                MIND combines advanced technology with compassionate design to provide 
                personalized emotional support when you need it most.
              </p>
              <div className="space-x-4">
                <Button 
                  className="bg-[#9B7EDC] hover:bg-[#8B6AD1] text-white px-8 py-6 text-lg shadow-lg shadow-[#E6E6FA] hover:shadow-[#D8D8FF] transition-all"
                  onClick={() => navigate('/signup')}
                >
                  Start Your Journey
                </Button>
                <Button 
                  variant="outline" 
                  className="text-[#9B7EDC] border-[#9B7EDC] hover:bg-[#E6E6FA]/20 px-8 py-6 text-lg hover:text-[#8B6AD1] transition-colors"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -top-8 -left-8 w-72 h-72 bg-[#E6E6FA] rounded-full filter blur-3xl opacity-40"></div>
              <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-[#D8D8FF] rounded-full filter blur-3xl opacity-40"></div>
              <div className="relative z-10 w-full h-96 bg-gradient-to-br from-[#E6E6FA] to-white rounded-2xl shadow-lg border border-[#E6E6FA]/50 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">💆‍♀️</div>
                  <h3 className="text-xl font-medium text-[#9B7EDC]">Calm, Supportive, Always Here</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-[#E6E6FA]/30 text-[#9B7EDC] rounded-full text-sm font-medium mb-4">
                Why Choose MIND?
              </span>
              <h3 className="text-3xl font-bold text-gray-800">Gentle Support for Your Mental Wellbeing</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Empathetic Interaction",
                  description: "Advanced emotion detection and sentiment analysis for personalized support",
                  icon: "🤝",
                  bg: "bg-gradient-to-br from-[#E6E6FA] to-[#F8F8FF]",
                  hover: "hover:shadow-lg hover:scale-105 hover:bg-[#F3F0FF]"
                },
                {
                  title: "24/7 Availability",
                  description: "Access support anytime, anywhere through our web-based platform",
                  icon: "⏰",
                  bg: "bg-gradient-to-br from-[#F8F8FF] to-[#E6E6FA]",
                  hover: "hover:shadow-lg hover:scale-105 hover:bg-[#E6E6FA]/80"
                },
                {
                  title: "Privacy Focused",
                  description: "Secure, anonymous conversations through encrypted channels",
                  icon: "🔒",
                  bg: "bg-gradient-to-br from-[#E6E6FA] to-[#F8F8FF]",
                  hover: "hover:shadow-lg hover:scale-105 hover:bg-[#F3F0FF]"
                },
                {
                  title: "Self-Help Resources",
                  description: "Access to mindfulness, breathing exercises, and emotional resilience techniques",
                  icon: "📚",
                  bg: "bg-gradient-to-br from-[#F8F8FF] to-[#E6E6FA]",
                  hover: "hover:shadow-lg hover:scale-105 hover:bg-[#E6E6FA]/80"
                },
                {
                  title: "Real-Time Support",
                  description: "Immediate responses and adaptive conversation based on your needs",
                  icon: "💭",
                  bg: "bg-gradient-to-br from-[#E6E6FA] to-[#F8F8FF]",
                  hover: "hover:shadow-lg hover:scale-105 hover:bg-[#F3F0FF]"
                },
                {
                  title: "Professional Insights",
                  description: "Optional progress tracking for healthcare professionals",
                  icon: "📊",
                  bg: "bg-gradient-to-br from-[#F8F8FF] to-[#E6E6FA]",
                  hover: "hover:shadow-lg hover:scale-105 hover:bg-[#E6E6FA]/80"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`p-8 rounded-2xl ${feature.bg} ${feature.hover} transition-all duration-300 border border-[#E6E6FA]/60 shadow-md flex flex-col items-center text-center`}
                  style={{ minHeight: '260px' }}
                >
                  <div className="text-5xl mb-5 drop-shadow-lg">{feature.icon}</div>
                  <h4 className="text-2xl font-semibold mb-2 text-[#7C5DC7]">{feature.title}</h4>
                  <p className="text-[#6B5CA5] text-base leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Testimonial Section */}
      <section className="relative px-6 py-24 bg-gradient-to-br from-[#E6E6FA] via-[#F8F8FF] to-white overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] h-96 bg-gradient-to-br from-[#B19EE3]/30 to-[#E6E6FA]/0 rounded-full blur-3xl opacity-60 -z-10"></div>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-6 py-2 bg-[#B19EE3]/20 text-[#7C5DC7] rounded-full text-base font-semibold mb-4 tracking-wide shadow-sm">What Our Users Say</span>
            <h3 className="text-4xl font-extrabold text-[#7C5DC7] mb-2 drop-shadow-lg">Real Stories. Real Impact.</h3>
            <p className="text-lg text-[#6B5CA5]/80">See how MIND is making a difference in people's lives every day.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/*
              {
                quote: "MIND has been a game-changer for my anxiety. The calming interface and thoughtful responses make me feel understood.",
                author: "Sarah J.",
                role: "Graphic Designer",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                quote: "As someone who struggles to open up, the anonymity of MIND helped me express myself freely without judgment.",
                author: "Michael T.",
                role: "University Student",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
              }
            */}
            { [
                {
                  quote: "MIND has been a game-changer for my anxiety. The calming interface and thoughtful responses make me feel understood.",
                  author: "Sarah J.",
                  role: "Graphic Designer",
                  avatar: "https://randomuser.me/api/portraits/women/44.jpg"
                },
                {
                  quote: "As someone who struggles to open up, the anonymity of MIND helped me express myself freely without judgment.",
                  author: "Michael T.",
                  role: "University Student",
                  avatar: "https://randomuser.me/api/portraits/men/32.jpg"
                }
              ].map((testimonial, index) => (
              <div key={index} className="relative bg-white/90 p-10 rounded-3xl shadow-xl border border-[#E6E6FA]/60 flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-2xl">
                <img src={testimonial.avatar} alt={testimonial.author} className="w-16 h-16 rounded-full border-4 border-[#E6E6FA] shadow-md mb-4 object-cover" />
                <div className="text-[#B19EE3] text-4xl leading-none mb-4">“</div>
                <p className="text-lg text-[#6B5CA5] mb-6 font-medium">{testimonial.quote}</p>
                <div>
                  <p className="font-bold text-[#7C5DC7]">{testimonial.author}</p>
                  <p className="text-sm text-[#B19EE3]">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-[#9B7EDC] to-[#B19EE3]">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">Ready to Start Your Wellness Journey?</h3>
          <p className="text-[#E6E6FA] mb-8 text-lg">
            Join thousands of others who have taken the first step towards better mental health.
          </p>
          <Button 
            className="bg-white text-[#9B7EDC] hover:bg-[#E6E6FA] px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all font-bold"
            onClick={() => navigate('/signup')}
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-t from-[#9B7EDC] to-[#B19EE3] text-white pt-16 pb-8 mt-0 relative z-10 shadow-inner">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div>
              <h4 className="font-extrabold text-2xl mb-4 text-white tracking-wide">MIND</h4>
              <p className="text-base text-[#E6E6FA] mb-6">Mental Intelligence for Nurturing Dialogue</p>
              <div className="flex space-x-3">
                {/*
                  { icon: 'Twitter', color: 'hover:bg-[#1DA1F2]' },
                  { icon: 'Facebook', color: 'hover:bg-[#4267B2]' },
                  { icon: 'Instagram', color: 'hover:bg-gradient-to-tr from-pink-500 to-yellow-400' }
                */}
                { [
                  { icon: 'Twitter', color: 'hover:bg-[#1DA1F2]' },
                  { icon: 'Facebook', color: 'hover:bg-[#4267B2]' },
                  { icon: 'Instagram', color: 'hover:bg-gradient-to-tr from-pink-500 to-yellow-400' }
                ].map((social, index) => (
                  <div key={index} className={`w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer transition ${social.color} hover:scale-110`}>
                    <span className="text-lg font-bold text-white">{social.icon[0]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">Resources</h5>
              <ul className="space-y-2 text-base text-[#E6E6FA]">
                <li className="hover:text-white cursor-pointer">Documentation</li>
                <li className="hover:text-white cursor-pointer">Support</li>
                <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer">Terms of Service</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">Company</h5>
              <ul className="space-y-2 text-base text-[#E6E6FA]">
                <li className="hover:text-white cursor-pointer">About Us</li>
                <li className="hover:text-white cursor-pointer">Contact</li>
                <li className="hover:text-white cursor-pointer">Careers</li>
                <li className="hover:text-white cursor-pointer">Blog</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">Get Help</h5>
              <ul className="space-y-2 text-base text-[#E6E6FA]">
                <li className="hover:text-white cursor-pointer">Crisis Resources</li>
                <li className="hover:text-white cursor-pointer">FAQ</li>
                <li className="hover:text-white cursor-pointer">Community</li>
                <li className="hover:text-white cursor-pointer">Feedback</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#E6E6FA]/30 pt-8 text-center text-base text-[#E6E6FA]">
            &copy; {new Date().getFullYear()} MIND Project — COMSATS University, Abbottabad Campus. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}