import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

import Container from "../../components/UI/Container/Container";
import AvatarCard from "../../components/UI/card/AvatarCard";
import ResumeDownload from "../../components/UI/card/ResumeDownload";
import SocialLinksComponents from "../../components/Sociallinks/SocialLinksComponents";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Home = () => {
  return (
    <>
      <Helmet>
        <link rel="canonical" href="https://mohdumar.online" />
        <title>
          Mohd Umar | MERN Stack Developer | PYTHON Developer India | FULL Stack
          Developer
        </title>{" "}
        <meta
          name="description"
          content="Mohd Umar is a MERN Stack Developer and React Developer from India specializing in Node.js, MongoDB, Express.js, Redux Toolkit, Docker, Redis and modern web applications."
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="Mohd Umar | MERN Stack Developer Portfolio"
        />
        <meta
          property="og:description"
          content="Full-stack developer from Noida, India specializing in MERN stack apps."
        />
        <meta
          property="og:image"
          content="https://mohdumar.online/banner.png"
        />
        <meta property="og:url" content="https://mohdumar.online" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Mohd Umar | MERN Stack Developer Portfolio"
        />
        <meta
          name="twitter:description"
          content="Explore the portfolio of Mohd Umar, a React and Node.js developer from Noida."
        />
        <meta
          name="twitter:image"
          content="https://mohdumar.online/banner.png"
        />
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

      <Container>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full items-center">
          {/* 🔹 Left: Avatar */}
          <motion.div
            className="flex items-center justify-center order-2 lg:order-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <AvatarCard size="w-72 h-72 md:w-96 md:h-96" />
          </motion.div>

          {/* 🔸 Right: Content */}
          <motion.div
            className="flex items-center justify-center order-1 lg:order-2 font-mono"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <aside className="space-y-6 max-w-xl">
              {/* Eyebrow */}
              <motion.div
                className="flex items-center gap-2 text-pink-500 text-xs uppercase tracking-widest"
                variants={fadeSlideUp}
              >
                <span
                  className="h-[2px] w-28 bg-gradient-to-l from-pink-500 to-transparent"
                  variants={fadeSlideUp}
                ></span>
                <span>INITIALIZING PORTFOLIO</span>
                <span
                  className="h-[2px] w-28 bg-gradient-to-r from-pink-500 to-transparent"
                  variants={fadeSlideUp}
                ></span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white"
                variants={fadeSlideUp}
              >
                HI, I'M{" "}
                <span className="text-cyan-400 drop-shadow-[0_0_18px_rgba(34,211,238,0.6)]">
                  MOHD UMAR
                </span>
              </motion.h1>

              {/* Underline accent */}
              <motion.div
                className="h-[2px] w-28 bg-gradient-to-r from-cyan-400 to-transparent"
                variants={fadeSlideUp}
              />

              {/* Role */}
              <motion.h2
                className="text-base md:text-lg uppercase tracking-widest text-gray-300"
                variants={fadeSlideUp}
              >
                <span className="text-cyan-400">&gt;</span> FULL STACK DEVELOPER
                | PYTHON DEVELOPER
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-gray-400 text-sm md:text-base leading-relaxed"
                variants={fadeSlideUp}
              >
                Full Stack Developer with 1+ year of hands-on experience,
                currently working as{" "}
                <span className="text-cyan-400 font-bold">
                  {" "}
                  Associate ERP Developer{" "}
                </span>{" "}
                at{" "}
                <span className="text-cyan-400 font-bold">
                  {" "}
                  A.Paul Software Systems{" "}
                </span>{" "}
                in Delhi. I specialize in MERN stack with expertise in Docker,
                Redis, WebSockets, and MySQL. I've built production applications
                including an EMS system with RBAC and rate limiting, a real-time
                secret chat app using Socket.io and Redis, and a YouTube clone.
                I'm looking for full-time or remote full stack opportunities to
                grow my career.
              </motion.p>

              {/* Social links */}
              <motion.div variants={fadeSlideUp}>
                <SocialLinksComponents
                  className="flex gap-4"
                  style={{ cursor: "pointer" }}
                />
              </motion.div>

              {/* CTAs */}
              <motion.div
                className="flex flex-wrap items-center gap-4 pt-2"
                variants={fadeSlideUp}
              >
                <ResumeDownload />

                <Link
                  to="/contact-us"
                  className="px-6 py-3 border border-cyan-500/40 text-cyan-400 uppercase tracking-widest text-sm font-bold hover:bg-cyan-400 hover:text-black transition-colors duration-300"
                  aria-label="Contact Mohd Umar"
                >
                  Contact_Me
                </Link>
              </motion.div>
            </aside>
          </motion.div>
        </section>
      </Container>
    </>
  );
};

export default Home;
