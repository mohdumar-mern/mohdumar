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
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
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
        <main>
          <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8"
          >
            {/* 🔸 Page Header */}
            <motion.header variants={cardVariants} className="text-center my-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
                My <span className="text-orange-500">Services</span>
              </h1>
              <p className="text-[#BDC3C7] text-sm sm:text-base">
                The services I offer to help clients achieve their digital goals.
              </p>
            </motion.header>

            {/*  Error */}
            {error && (
              <motion.p
                variants={cardVariants}
                className="text-red-500 text-center mb-6 text-lg font-semibold"
              >
                {error}
              </motion.p>
            )}

            {/*  Services Grid */}
            <motion.div
              variants={containerVariants}
              className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 "
            >
              {!loading && services.length > 0 ? (
                services.map((service) => (
                  <motion.div key={service._id} variants={cardVariants}>
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
                    className="text-white text-center col-span-full mt-8"
                  >
                    No services available at the moment.
                  </motion.p>
                )
              )}
            </motion.div>

            {/* 🔁 Loader */}
            {loading && (
              <div className="text-center mt-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-gray-400 mt-2">Loading Services...</p>
              </div>
            )}
          </motion.section>
        </main>
      </Container>
    </>
  );
};

export default ServicesPage;
