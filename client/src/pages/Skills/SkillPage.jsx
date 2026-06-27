import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSkills } from "../../features/Skills/skillSlice";

import Container from "../../components/UI/Container/Container";
import SkillCard from "../../components/UI/card/SkillCard";

import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const SkillPage = () => {
  const dispatch = useDispatch();
  const { skills = [], error, loading } = useSelector((state) => state.skill);

  useEffect(() => {
    if (!skills.length) {
      dispatch(fetchSkills());
    }
  }, [dispatch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        when: "beforeChildren",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const renderSkills = () => {
    if (loading) {
      return (
        <div className="text-center mt-12 col-span-full">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-gray-500 text-sm uppercase tracking-widest mt-3">
            Loading_skills...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <p className="text-pink-500 text-center col-span-full text-sm">
          {error}
        </p>
      );
    }

    if (!skills.length) {
      return (
        <p className="text-gray-500 text-center col-span-full mt-8 text-sm uppercase tracking-widest">
          No_skills_available
        </p>
      );
    }

    return (
      <motion.div
        className="contents"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
       {skills.map((skill) => (
  <motion.div
    key={skill._id}
    variants={cardVariants}
    className="h-full"
    whileHover={{ scale: 1.04 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <SkillCard
      title={skill.title}
      level={skill.level}
      imageUrl={skill?.file?.url}
      category={skill.category}
    />
  </motion.div>
))}
      </motion.div>
    );
  };

  const skillNames = skills?.length ? skills.map((s) => s.title) : [];

  return (
    <>
      <Helmet>
        <title>Skills | Mohd Umar - MERN Stack Developer</title>
        <meta
          name="description"
          content="Explore the skills and technologies Mohd Umar has mastered including React, Node.js, MongoDB, Express, and more."
        />
        <meta name="robots" content="index, follow" />
        <html lang="en" />

        {skillNames.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Mohd Umar",
              jobTitle: "MERN Stack Developer",
              url: "https://umarportfolio-frontend.vercel.app",
              knowsAbout: skillNames,
            })}
          </script>
        )}
      </Helmet>

      <Container>
        <main className="w-full">
          <section className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-mono">
            {/* 🔸 Header */}
            <div className="max-w-6xl mx-auto mb-14">
              <div className="flex items-center gap-2 text-pink-500 text-xs uppercase tracking-widest">
                <span>//</span>
                <span>Skill_Tree</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mt-3">
                MY{" "}
                <span className="text-cyan-400 drop-shadow-[0_0_18px_rgba(34,211,238,0.6)]">
                  SKILLS
                </span>
              </h1>

              <div className="h-[2px] w-28 bg-gradient-to-r from-cyan-400 to-transparent mt-4 mb-4" />

              <p className="text-gray-400 text-sm sm:text-base">
                Technologies I've worked with and mastered
              </p>
            </div>

            {/* 🔹 Skills Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
              {renderSkills()}
            </div>
          </section>
        </main>
      </Container>
    </>
  );
};

export default React.memo(SkillPage);