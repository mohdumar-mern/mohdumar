import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchServices } from "../../features/service/serviceSlice";
import Container from "../../components/UI/Container/Container";
import ServiceCard from "../../components/UI/card/ServiceCard";

import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const ServicesPage = () => {
  const dispatch = useDispatch();
  const { services, error, loading } = useSelector((state) => state.service);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10,
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <Helmet>
        <title>Services | Mohd Umar - MERN Stack Developer</title>
        <meta
          name="description"
          content="Explore the professional web development services offered by Mohd Umar, including full-stack development, API integration, and responsive design."
        />
        <meta name="robots" content="index, follow" />
        <html lang="en" />
      </Helmet>

      <Container>
        <main className="w-full">
          <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-mono"
          >
            {/* 🔸 Page Header */}
            <motion.header variants={cardVariants} className="max-w-6xl mx-auto mb-14">
              <div className="flex items-center gap-2 text-pink-500 text-xs uppercase tracking-widest">
                <span>//</span>
                <span>Service_Modules</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mt-3">
                MY{" "}
                <span className="text-cyan-400 drop-shadow-[0_0_18px_rgba(34,211,238,0.6)]">
                  SERVICES
                </span>
              </h1>

              <div className="h-[2px] w-28 bg-gradient-to-r from-cyan-400 to-transparent mt-4 mb-4" />

              <p className="text-gray-400 text-sm sm:text-base">
                The services I offer to help clients achieve their digital goals.
              </p>
            </motion.header>

            {/* ❌ Error */}
            {error && (
              <motion.p
                variants={cardVariants}
                className="text-center text-pink-500 text-sm mb-6"
              >
                {error}
              </motion.p>
            )}

            {/* ✅ Services Grid */}
            <motion.div
              variants={containerVariants}
              className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch"
            >
              {!loading && services.length > 0 ? (
              services.map((service) => (
                <motion.div
                  key={service._id}
                  variants={cardVariants}
                  className="h-full"
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <ServiceCard
                    title={service.title}
                    category={service.category}
                    imageUrl={service?.file?.url}
                    description={service.description}
                  />
                </motion.div>
              ))
              ) : (
                !loading && (
                  <motion.p
                    variants={cardVariants}
                    className="text-gray-500 text-sm uppercase tracking-widest text-center col-span-full mt-8"
                  >
                    No_services_available
                  </motion.p>
                )
              )}
            </motion.div>

            {/* 🔁 Loader */}
            {loading && (
              <div className="text-center mt-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-400 mx-auto"></div>
                <p className="text-gray-500 text-sm uppercase tracking-widest mt-3">
                  Loading_services...
                </p>
              </div>
            )}
          </motion.section>
        </main>
      </Container>
    </>
  );
};

export default ServicesPage;