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
    if(!skills.length){
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
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  const renderSkills = () => {
    if (loading) {
      return (
        <div className="text-center mt-12 col-span-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading skills...</p>
        </div>
      );
    }

    if (error) {
      return (
        <p className="text-red-500 text-center col-span-full font-semibold text-lg">
          {error}
        </p>
      );
    }

    if (!skills.length) {
      return (
        <p className="text-white text-center col-span-full mt-8">
          No skills available at the moment.
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
          <motion.div key={skill._id} variants={cardVariants}>
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
      {/* 🔹 SEO Head */}
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
        <main>
          <section className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            {/* 🔸 Header */}
            <div className="text-center my-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
                My <span className="text-orange-500">Skills</span>
              </h1>
              <p className="text-[#BDC3C7] text-sm sm:text-base">
                Technologies I've worked with and mastered
              </p>
            </div>

            {/* 🔹 Skills Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {renderSkills()}
            </div>
          </section>
        </main>
      </Container>
    </>
  );
};

export default React.memo(SkillPage);
