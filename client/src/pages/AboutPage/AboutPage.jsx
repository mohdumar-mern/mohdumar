import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

import Container from "../../components/UI/Container/Container";
import AvatarCard from "../../components/UI/card/AvatarCard";

const AboutPage = () => {
  const skills = useMemo(
    () => ["JavaScript", "React", "Node.js", "Git", "NPM", "Express", "MongoDB", "Docker", "Redis"],
    []
  );

  const fadeSlideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <>
      {/* 🔹 SEO Meta Tags */}
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

      <Container>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full items-center font-mono">
          {/* 🔹 Left: About Text */}
          <motion.div
            className="flex items-center justify-center order-2 lg:order-1"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <aside className="space-y-6 max-w-xl">
              {/* Eyebrow */}
              <motion.div
                className="flex items-center gap-2 text-pink-500 text-xs uppercase tracking-widest"
                variants={fadeSlideUp}
              >
                <span>//</span>
                <span>Operator_Profile</span>
              </motion.div>

              <motion.h1
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white"
                variants={fadeSlideUp}
              >
                ABOUT{" "}
                <span className="text-cyan-400 drop-shadow-[0_0_18px_rgba(34,211,238,0.6)]">
                  ME
                </span>
              </motion.h1>

              <motion.div
                className="h-[2px] w-28 bg-gradient-to-r from-cyan-400 to-transparent"
                variants={fadeSlideUp}
              />

              {/* Role */}
              <motion.h2
                className="text-base md:text-lg uppercase tracking-widest text-gray-300"
                variants={fadeSlideUp}
              >
                <span className="text-cyan-400">&gt;</span> Full_Stack_Developer
              </motion.h2>

              <motion.p
                className="text-gray-400 text-sm md:text-base leading-relaxed"
                variants={fadeSlideUp}
              >
                Hi, I'm Mohd Umar, a MERN Stack Developer from Noida, Uttar
                Pradesh, India. I enjoy building full-stack web applications
                that are fast, responsive, and user-friendly.
              </motion.p>

              <motion.p
                className="text-gray-400 text-sm md:text-base leading-relaxed"
                variants={fadeSlideUp}
              >
                I connect front-end and back-end seamlessly using RESTful APIs,
                manage state efficiently with Redux, and focus on secure,
                scalable, and responsive web apps.
              </motion.p>

              {/* Skills */}
              <div>
                <motion.h3
                  className="flex items-center gap-2 text-cyan-400 text-xs uppercase tracking-widest mb-3"
                  variants={textVariants}
                >
                  <span>//</span>
                  <span>Tech_Stack</span>
                </motion.h3>
                <motion.ul
                  className="flex flex-wrap gap-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {skills.map((skill, index) => (
                    <motion.li
                      key={index}
                      title={skill}
                      className="border border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-400 hover:text-black text-cyan-300 text-xs uppercase tracking-widest px-4 py-2 transition-colors duration-300 cursor-default"
                      variants={textVariants}
                    >
                      {skill}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </aside>
          </motion.div>

          {/* 🔸 Right: Avatar */}
          <motion.div
            className="flex items-center justify-center order-1 lg:order-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <AvatarCard size="w-72 h-72 md:w-80 md:h-80" />
          </motion.div>
        </section>
      </Container>
    </>
  );
};

export default React.memo(AboutPage);