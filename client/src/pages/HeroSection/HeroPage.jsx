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
      staggerChildren: 0.3,
    },
  },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const buttonHover = {
  scale: 1.05,
  boxShadow: "0 0 8px rgb(255, 165, 0)",
  transition: { duration: 0.3, ease: "easeInOut" },
};

const avatarHover = {
  scale: 1.05,
  transition: { duration: 0.5, yoyo: Infinity, ease: "easeInOut" },
};

const Home = () => {
  return (
    <>
      {/* 🔹 SEO Meta Tags */}
      <Helmet>
        <title>Mohd Umar | MERN Stack Developer Portfolio</title>
        <meta
          name="description"
          content="Mohd Umar is a MERN Stack Developer from Noida. Explore full-stack projects, skills, resume, and services."
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* 🔹 Open Graph (Social Share) */}
        <meta property="og:title" content="Mohd Umar | MERN Stack Developer Portfolio" />
        <meta
          property="og:description"
          content="Full-stack developer from Noida, India specializing in MERN stack apps."
        />
        <meta
          property="og:image"
          content="https://umarportfolio-frontend.vercel.app/banner.png"
        />
        <meta property="og:url" content="https://umarportfolio-frontend.vercel.app/" />
        <meta property="og:type" content="website" />

        {/* 🔹 Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mohd Umar | MERN Stack Developer Portfolio" />
        <meta
          name="twitter:description"
          content="Explore the portfolio of Mohd Umar, a React and Node.js developer from Noida."
        />
        <meta
          name="twitter:image"
          content="https://umarportfolio-frontend.vercel.app/banner.png"
        />

        {/* 🔹 Structured Data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Mohd Umar",
              "url": "https://umarportfolio.vercel.app",
              "sameAs": [
                "https://github.com/mohdumar-mern",
                "https://linkedin.com/in/mohd-umar-mern-stack-developer"
              ],
              "jobTitle": "MERN Stack Developer",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Noida",
                "addressRegion": "Uttar Pradesh",
                "addressCountry": "India"
              }
            }
          `}
        </script>
      </Helmet>

      <Container>
        <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] w-full shadow-2xl rounded-xl overflow-hidden">
          {/* 🔹 Left: Avatar Card */}
          <motion.div
            className="flex items-center justify-center bg-orange-500 p-10 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            {/* <motion.div
              // whileHover={avatarHover}
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
            > */}
              <AvatarCard size="w-96 h-96" />

            {/* </motion.div> */}
          </motion.div>

          {/* 🔸 Right: Content Section */}
          <motion.div
            className="flex items-center justify-center bg-black px-6 lg:px-12 py-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.aside className="space-y-6 max-w-xl text-white">
              <motion.h1
                className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-orange-400"
                variants={fadeSlideUp}
              >
                Hi, I'm Mohd Umar
              </motion.h1>

              <motion.h2
                className="text-lg md:text-xl lg:text-2xl font-medium"
                variants={fadeSlideUp}
              >
                I'm a&nbsp;
                <span className="text-orange-400 font-semibold">
                  MERN Stack Developer
                </span>
              </motion.h2>

              <motion.p
                className="text-gray-300 text-base md:text-lg leading-relaxed"
                variants={fadeSlideUp}
              >
                I'm a MERN Stack Developer from Noida, India. I specialize in
                building full-stack applications using MongoDB, Express.js,
                React, and Node.js. I focus on REST APIs, Redux state
                management, secure backends, and performance optimization.
                Let's build something amazing together!
              </motion.p>

              <motion.div variants={fadeSlideUp}>
                <SocialLinksComponents
                  className="flex gap-4"
                  style={{ cursor: "pointer" }}
                />
              </motion.div>

              <motion.div
                className="flex flex-wrap items-center gap-4 pt-2"
                variants={fadeSlideUp}
              >
                <motion.div whileHover={buttonHover}>
                  <ResumeDownload />
                </motion.div>

                <motion.div whileHover={buttonHover}>
                  <Link
                    to="/contact-us"
                    className="px-6 py-2 rounded-md border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition duration-300"
                    aria-label="Contact Mohd Umar"
                  >
                    Contact Me
                  </Link>
                </motion.div>
              </motion.div>
            </motion.aside>
          </motion.div>
        </section>
      </Container>
    </>
  );
};

export default Home;
