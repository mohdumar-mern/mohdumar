import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";

import Container from "../../components/UI/Container/Container";
import AvatarCard from "../../components/UI/card/AvatarCard";

const AboutPage = () => {
  const skills = useMemo(
    () => ["JavaScript", "React", "Node.js", "Git", "NPM", "Express", "MongoDB", "Docker", "Redis"],
    []
  );

  return (
    <>
      <Helmet>
        <title>About | Mohd Umar - MERN Stack Developer</title>
        <meta
          name="description"
          content="Learn more about Mohd Umar, a MERN Stack Developer from Noida, skilled in JavaScript, React, Node.js, Express, and MongoDB."
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Mohd Umar",
              "url": "https://umarportfolio-frontend.vercel.app/about",
              "jobTitle": "MERN Stack Developer",
              "worksFor": {
                "@type": "Organization",
                "name": "Freelance"
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Noida",
                "addressRegion": "Uttar Pradesh",
                "addressCountry": "India"
              },
              "knowsAbout": ["React", "Node.js", "MongoDB", "JavaScript", "Express"]
            }
          `}
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
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full items-center font-mono">
          {/* 🔹 Left: About Text */}
          <div className="flex items-center justify-center order-2 lg:order-1">
            <aside className="space-y-6 max-w-xl">
              {/* Eyebrow */}
              <div
                className="flex items-center gap-2 text-pink-500 text-xs uppercase tracking-widest fade-slide-up"
                style={{ animationDelay: "0s" }}
              >
                <span>//</span>
                <span>Operator_Profile</span>
              </div>

              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white fade-slide-up"
                style={{ animationDelay: "0.1s" }}
              >
                ABOUT{" "}
                <span className="text-cyan-400 drop-shadow-[0_0_18px_rgba(34,211,238,0.6)]">
                  ME
                </span>
              </h1>

              <div
                className="h-[2px] w-28 bg-gradient-to-r from-cyan-400 to-transparent fade-slide-up"
                style={{ animationDelay: "0.2s" }}
              />

              {/* Role */}
              <h2
                className="text-base md:text-lg uppercase tracking-widest text-gray-300 fade-slide-up"
                style={{ animationDelay: "0.3s" }}
              >
                <span className="text-cyan-400">&gt;</span> Full_Stack_Developer
              </h2>

              <p
                className="text-gray-400 text-sm md:text-base leading-relaxed fade-slide-up"
                style={{ animationDelay: "0.4s" }}
              >
                Hi, I'm Mohd Umar, a MERN Stack Developer from Noida, Uttar
                Pradesh, India. I enjoy building full-stack web applications
                that are fast, responsive, and user-friendly.
              </p>

              <p
                className="text-gray-400 text-sm md:text-base leading-relaxed fade-slide-up"
                style={{ animationDelay: "0.5s" }}
              >
                I connect front-end and back-end seamlessly using RESTful APIs,
                manage state efficiently with Redux, and focus on secure,
                scalable, and responsive web apps.
              </p>

              {/* Skills */}
              <div>
                <h3
                  className="flex items-center gap-2 text-cyan-400 text-xs uppercase tracking-widest mb-3 fade-slide-up"
                  style={{ animationDelay: "0.6s" }}
                >
                  <span>//</span>
                  <span>Tech_Stack</span>
                </h3>
                <ul className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <li
                      key={index}
                      title={skill}
                      className="border border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-400 hover:text-black text-cyan-300 text-xs uppercase tracking-widest px-4 py-2 transition-colors duration-300 cursor-default fade-slide-up"
                      style={{ animationDelay: `${0.7 + index * 0.05}s` }}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          {/* 🔸 Right: Avatar */}
          <div className="flex items-center justify-center order-1 lg:order-2 fade-in">
            <AvatarCard size="w-72 h-72 md:w-80 md:h-80" />
          </div>
        </section>
      </Container>
    </>
  );
};

export default React.memo(AboutPage);