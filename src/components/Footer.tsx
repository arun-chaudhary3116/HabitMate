"use client";

import { Input } from "@/components/ui/input";
import StyledButton from "@/components/ui/StyledButton";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const footerLinks = {
    Product: ["Features", "Pricing", "Integrations", "API", "Changelog"],
    Company: ["About", "Blog", "Careers", "Press", "Partners"],
    Support: ["Help Center", "Contact", "Status", "Community"],
    Legal: ["Privacy", "Terms", "Security", "Cookies"],
  };

  const socialLinks = [
    { icon: Twitter, href: "https://x.com/ArunCha44132393", label: "Twitter" },
    {
      icon: Github,
      href: "https://github.com/arun-chaudhary3116",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/arun-chaudhary-33886427a/",
      label: "LinkedIn",
    },
    { icon: Mail, href: "/", label: "Email" },
  ];

  const handleSubscribe = async () => {
    if (!email) return setMessage("Please enter your email");
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(
        "http://localhost:8000/api/v2/newsletter/subscribe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Subscription failed");

      setMessage("Subscribed successfully! 🎉");
      setEmail("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setMessage(err.message || "Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Brand and Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold gradient-text mb-3">
                HabitMate
              </h3>
              <p className="text-muted-foreground max-w-md">
                Build better habits, one day at a time. Join thousands of users
                who trust HabitMate to track their progress and achieve their
                goals.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Stay updated</h4>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <StyledButton
                  text={loading ? "Subscribing…" : "Subscribe"}
                  onClick={handleSubscribe}
                />
              </div>
              {message && (
                <p className="text-sm text-muted-foreground">{message}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Get product updates and habit-building tips delivered to your
                inbox.
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-semibold mb-4">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-primary transition-colors duration-300"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-muted-foreground text-sm">
              © 2024 HabitMate. All rights reserved.
            </p>

            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
