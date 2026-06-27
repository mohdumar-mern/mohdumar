import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Container from "../../components/UI/Container/Container";
import AvatarCard from "../../components/UI/card/AvatarCard";
import ResumeDownload from "../../components/UI/card/ResumeDownload";
import SocialLinksComponents from "../../components/Sociallinks/SocialLinksComponents";

const Home = () => {
  return (
    <>
      <Helmet>
        <link rel="canonical" href="https://mohdumar.online" />
        <title>Mohd Umar | MERN Stack Developer in India</title>
        <meta
          name="description"
          content="Mohd Umar is a MERN Stack Developer from India specializing in React, Node.js, MongoDB, Express, Redux Toolkit, Docker, and Redis."
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:title" content="Mohd Umar | MERN Stack Developer Portfolio" />
        <meta
          property="og:description"
          content="Full-stack developer from Noida, India specializing in MERN stack apps."
        />
        <meta property="og:image" content="https://mohdumar.online/banner.webp" />
        <meta property="og:url" content="https://mohdumar.online" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mohd Umar | MERN Stack Developer Portfolio" />
        <meta
          name="twitter:description"
          content="Explore the portfolio of Mohd Umar, a React and Node.js developer from Noida."
        />
        <meta name="twitter:image" content="https://mohdumar.online/banner.webp" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Mohd Umar",
            url: "https://mohdumar.online",
            jobTitle: "MERN Stack Developer",
            description:
              "MERN Stack Developer specializing in React.js, Node.js, Express.js and MongoDB",
            sameAs: [
              "https://github.com/mohdumar-mern",
              "https://linkedin.com/in/mohd-umar-mern-stack-developer",
            ],
            knowsAbout: [
              "React.js",
              "Node.js",
              "Express.js",
              "GitHub",
              "CI/CD",
              "MongoDB",
              "Redux Toolkit",
              "Docker",
              "Redis",
              "JavaScript",
            ],
          })}
        </script>
      </Helmet>

      {/* Manual CSS animations — no framer-motion dependency on this page */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 1.2s ease-out both;
        }
        .fade-slide-up {
          opacity: 0;
          animation: fadeSlideUp 0.6s ease-out forwards;
        }
      `}</style>

      <Container>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full items-center">
          {/* 🔹 Left: Avatar */}
          <div className="flex items-center justify-center order-2 lg:order-1 fade-in">
            <AvatarCard size="w-72 h-72 md:w-96 md:h-96" priority />
          </div>

          {/* 🔸 Right: Content */}
          <div className="flex items-center justify-center order-1 lg:order-2 font-mono">
            <aside className="space-y-6 max-w-xl">
              {/* Eyebrow */}
              <div
                className="flex items-center gap-2 text-pink-500 text-xs uppercase tracking-widest fade-slide-up"
                style={{ animationDelay: "0s" }}
              >
                <span className="h-[2px] w-12 bg-gradient-to-l from-pink-500 to-transparent" />
                <span>Initializing Portfolio</span>
                <span className="h-[2px] w-12 bg-gradient-to-r from-pink-500 to-transparent" />
              </div>

              {/* Heading */}
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white fade-slide-up"
                style={{ animationDelay: "0.1s" }}
              >
                HI, I'M{" "}
                <span className="text-cyan-400 drop-shadow-[0_0_18px_rgba(34,211,238,0.6)]">
                  MOHD UMAR
                </span>
              </h1>

              {/* Underline accent */}
              <div
                className="h-[2px] w-28 bg-gradient-to-r from-cyan-400 to-transparent fade-slide-up"
                style={{ animationDelay: "0.2s" }}
              />

              {/* Role */}
              <h2
                className="text-base md:text-lg uppercase tracking-widest text-gray-300 fade-slide-up"
                style={{ animationDelay: "0.3s" }}
              >
                <span className="text-cyan-400">&gt;</span> Full Stack Developer |
                Python Developer
              </h2>

              {/* Description */}
              <p
                className="text-gray-400 text-sm md:text-base leading-relaxed fade-slide-up"
                style={{ animationDelay: "0.4s" }}
              >
                Full Stack Developer with 1+ year of hands-on experience,
                currently working as{" "}
                <span className="text-cyan-400 font-bold">
                  Associate ERP Developer
                </span>{" "}
                at{" "}
                <span className="text-cyan-400 font-bold">
                  A.Paul Software Systems
                </span>{" "}
                in Delhi. I specialize in MERN stack with expertise in Docker,
                Redis, WebSockets, and MySQL. I've built production
                applications including an EMS system with RBAC and rate
                limiting, a real-time secret chat app using Socket.io and
                Redis, and a YouTube clone. I'm looking for full-time or
                remote full stack opportunities to grow my career.
              </p>

              {/* Social links */}
              <div className="fade-slide-up" style={{ animationDelay: "0.5s" }}>
                <SocialLinksComponents
                  className="flex gap-4"
                  style={{ cursor: "pointer" }}
                />
              </div>

              {/* CTAs */}
              <div
                className="flex flex-wrap items-center gap-4 pt-2 fade-slide-up"
                style={{ animationDelay: "0.6s" }}
              >
                <ResumeDownload />

                <Link
                  to="/contact-us"
                  className="px-6 py-3 border border-cyan-500/40 text-cyan-400 uppercase tracking-widest text-sm font-bold hover:bg-cyan-400 hover:text-black transition-colors duration-300"
                  aria-label="Contact Mohd Umar"
                >
                  Contact_Me
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </Container>
    </>
  );
};

export default Home;