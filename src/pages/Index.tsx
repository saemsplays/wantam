import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AlertTriangle, Shield, Download, Users, MessageSquare, Calendar, FileText, Zap, Smartphone, Radio, Heart, Mail, Share2, Phone, MapPin, Globe, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AuthButton } from "@/components/AuthButton";
import { useAuth } from "@/hooks/useAuth";
import { useSecureDownload } from "@/hooks/useSecureDownload";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const stats = [
  { label: "Active Users", value: "3,500+", icon: Users },
  { label: "Bills Tracked", value: "150+", icon: FileText },
  { label: "Events Organized", value: "40+", icon: Calendar },
  { label: "Community Posts", value: "1,200+", icon: MessageSquare },
];

const features = [
  {
    title: "Real-time Bill Tracking",
    description:
      "Stay updated with the latest legislative developments as they happen.",
    icon: Shield,
  },
  {
    title: "Civic Education Resources",
    description:
      "Access a wealth of educational materials to understand your rights and responsibilities.",
    icon: AlertTriangle,
  },
  {
    title: "Community Discussions",
    description:
      "Engage in meaningful conversations with fellow citizens and share your perspectives.",
    icon: MessageSquare,
  },
  {
    title: "Volunteer Opportunities",
    description:
      "Find and participate in local initiatives to make a difference in your community.",
    icon: Heart,
  },
  {
    title: "Event Notifications",
    description:
      "Receive timely reminders about important civic events and workshops.",
    icon: Calendar,
  },
  {
    title: "Mobile Accessibility",
    description:
      "Access CEKA on the go with our mobile app, ensuring civic engagement is always at your fingertips.",
    icon: Smartphone,
  },
];

const Index = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const { user } = useAuth();
  const { getSecureDownloadUrl, loading: downloadLoading } = useSecureDownload();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroImageRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const heroImageY = useTransform(
    scrollYProgress,
    [0, 0.2],
    ["0%", "15%"]
  );
  const heroTitleOpacity = useTransform(
    scrollYProgress,
    [0, 0.1],
    ["1", "0"]
  );
  const featuresY = useTransform(
    scrollYProgress,
    [0.2, 0.4],
    ["100px", "0px"]
  );
  const featuresOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.4],
    ["0", "1"]
  );
  const statsY = useTransform(
    scrollYProgress,
    [0.4, 0.6],
    ["100px", "0px"]
  );
  const statsOpacity = useTransform(
    scrollYProgress,
    [0.4, 0.6],
    ["0", "1"]
  );
  const downloadY = useTransform(
    scrollYProgress,
    [0.6, 0.8],
    ["100px", "0px"]
  );
  const downloadOpacity = useTransform(
    scrollYProgress,
    [0.6, 0.8],
    ["0", "1"]
  );
  const faqY = useTransform(
    scrollYProgress,
    [0.8, 1],
    ["100px", "0px"]
  );
  const faqOpacity = useTransform(
    scrollYProgress,
    [0.8, 1],
    ["0", "1"]
  );
  const contactY = useTransform(
    scrollYProgress,
    [0.8, 1],
    ["100px", "0px"]
  );
  const contactOpacity = useTransform(
    scrollYProgress,
    [0.8, 1],
    ["0", "1"]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px",
      }
    );

    if (heroImageRef.current) observer.observe(heroImageRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (statsRef.current) observer.observe(statsRef.current);
    if (downloadRef.current) observer.observe(downloadRef.current);
    if (faqRef.current) observer.observe(faqRef.current);
    if (contactRef.current) observer.observe(contactRef.current);

    return () => observer.disconnect();
  }, []);

  const handleDownload = async () => {
    try {
      const url = await getSecureDownloadUrl('apps', 'ceka-mobile-app.apk');
      if (url) {
        window.open(url, '_blank');
      } else {
        console.error('Failed to generate download URL');
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const faqData = [
    {
      question: "What is CEKA?",
      answer:
        "CEKA is a platform designed to enhance civic engagement by providing resources, tools, and opportunities for citizens to participate in governance and community development.",
    },
    {
      question: "How can I track bills and legislative developments?",
      answer:
        "Our platform offers real-time bill tracking, allowing you to stay updated with the latest legislative developments as they happen.",
    },
    {
      question: "What kind of educational resources are available?",
      answer:
        "We provide a wealth of educational materials to help you understand your rights, responsibilities, and the processes of governance.",
    },
    {
      question: "How can I participate in community discussions?",
      answer:
        "You can engage in meaningful conversations with fellow citizens and share your perspectives through our community discussion forums.",
    },
    {
      question: "Are there opportunities for volunteering?",
      answer:
        "Yes, we list various volunteer opportunities in local initiatives, allowing you to make a difference in your community.",
    },
    {
      question: "How do I receive notifications about civic events?",
      answer:
        "You can sign up for event notifications to receive timely reminders about important civic events and workshops.",
    },
    {
      question: "Is there a mobile app for CEKA?",
      answer:
        "Yes, our mobile app ensures that civic engagement is always at your fingertips, allowing you to access CEKA on the go.",
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">CEKA</span>
          </div>
          <div className="flex items-center gap-4">
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          ref={heroImageRef}
          style={{ y: heroImageY }}
          className="absolute top-0 left-0 w-full h-full bg-[url('/hero.jpg')] bg-cover bg-center z-0"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10" />
        <div className="container mx-auto px-4 text-center relative z-20">
          <motion.h1
            ref={heroTitleRef}
            style={{ opacity: heroTitleOpacity }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4"
          >
            Empowering Citizens, Transforming Kenya
          </motion.h1>
          <motion.p
            style={{ opacity: heroTitleOpacity }}
            className="text-lg text-gray-300 mb-8"
          >
            Your platform for civic engagement, legislative tracking, and community empowerment.
          </motion.p>
          <motion.div
            style={{ opacity: heroTitleOpacity }}
            className="flex items-center justify-center gap-4"
          >
            <Button size="lg" className="gap-2 text-lg">
              <Radio className="h-5 w-5" />
              Tune into Civic FM
            </Button>
            <Button variant="outline" size="lg" className="gap-2 text-lg">
              Learn More
              <ChevronRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            style={{ y: featuresY, opacity: featuresOpacity }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Key Features</h2>
            </div>
            <p className="text-xl text-muted-foreground">
              Explore the tools and resources that make CEKA the ultimate platform for civic engagement.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-secondary/10 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" ref={statsRef} className="py-16 bg-secondary/5">
        <div className="container mx-auto px-4">
          <motion.div
            style={{ y: statsY, opacity: statsOpacity }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="bg-background shadow-sm">
                <CardHeader>
                  <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <CardTitle className="text-3xl font-bold">{stat.value}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">{stat.label}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Update the download section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Smartphone className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Get the CEKA Mobile App</h2>
            </div>
            <p className="text-xl text-muted-foreground mb-8">
              Take civic engagement with you anywhere. Download our mobile app for Android devices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="gap-2 text-lg px-8 py-6"
                onClick={handleDownload}
                disabled={downloadLoading}
              >
                <Download className="h-5 w-5" />
                {downloadLoading ? 'Generating Download...' : 'Download for Android'}
              </Button>
              <p className="text-sm text-muted-foreground">
                Version 1.0 • Compatible with Android 7.0+
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" ref={faqRef} className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            style={{ y: faqY, opacity: faqOpacity }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            </div>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about CEKA and civic engagement.
            </p>
          </motion.div>
          <motion.div
            style={{ y: faqY, opacity: faqOpacity }}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible>
              {faqData.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4">
          <motion.div
            style={{ y: contactY, opacity: contactOpacity }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Mail className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Contact Us</h2>
            </div>
            <p className="text-xl text-muted-foreground">
              Reach out to us for inquiries, support, or partnership opportunities.
            </p>
          </motion.div>
          <motion.div
            style={{ y: contactY, opacity: contactOpacity }}
            className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <Card className="bg-background shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">General Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  For general questions and information, please contact:
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href="mailto:info@ceka.or.ke" className="hover:underline">info@ceka.or.ke</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <a href="tel:+254700000000" className="hover:underline">+254 700 000 000</a>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Visit Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our offices are located at:
                </p>
                <div className="flex items-start gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">CEKA Headquarters</p>
                    <p className="text-muted-foreground">
                      Nairobi, Kenya
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <a href="https://ceka.or.ke" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                    www.ceka.or.ke
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} CEKA. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
