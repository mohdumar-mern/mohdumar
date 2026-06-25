import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LayoutComponents from "./components/Layout/Layout";
import HeroPage from "./pages/HeroSection/HeroPage";

// Lazy loaded pages
const AboutPage = lazy(() => import("./pages/AboutPage/AboutPage"));
const ProjectPage = lazy(() => import("./pages/projects/ProjectPage"));
const SkillPage = lazy(() => import("./pages/Skills/SkillPage"));
const ServicesPage = lazy(() => import("./pages/Services/ServicesPage"));
const ContactPage = lazy(() => import("./pages/Contact/ContatPage"));
const LoginPage = lazy(() => import("./pages/Login/LoginPage"));

// Lazy loaded dashboard components
const ProtectedRoute = lazy(() => import("./routes/ProtectedRoute"));
const DashboardLayout = lazy(() =>
  import("./private/Dashboard/DashboardLayut/DashboardLayout")
);
const DashboardHome = lazy(() =>
  import("./private/Dashboard/DashboardHome/DashboardHome")
);
const ProjectList = lazy(() =>
  import("./private/Dashboard/project/ProjectList")
);
const ProjctDetail = lazy(() =>
  import("./private/Dashboard/project/ProjectDetails")
);
const ProjectAddUpdate = lazy(() =>
  import("./private/Dashboard/project/ProjectAddAndUpdate")
);
const SkillsList = lazy(() => import("./private/Dashboard/Skills/SkillList"));
const SkillDetail = lazy(() =>
  import("./private/Dashboard/Skills/SkillDetail")
);
const AddAndUpdateSkill = lazy(() =>
  import("./private/Dashboard/Skills/AddAndUpdateSkill")
);
const ServicesList = lazy(() =>
  import("./private/Dashboard/Services/ServicesList")
);
const AddService = lazy(() =>
  import("./private/Dashboard/Services/AddService")
);
const ServiceDetail = lazy(() =>
  import("./private/Dashboard/Services/ServiceDetail")
);
const ContactList = lazy(() =>
  import("./private/Dashboard/contact/ContactList")
);
const ContactDetail = lazy(() =>
  import("./private/Dashboard/contact/ContactDetail")
);
const ProfileDetail = lazy(() =>
  import("./private/Dashboard/Profile/ProfileDetail")
);
const UpdateProfile = lazy(() =>
  import("./private/Dashboard/Profile/UpdateProfile")
);

const App = () => (
  <Router>
    <LayoutComponents>
      <Toaster position="top-right" reverseOrder={false} />
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectPage />} />
          <Route path="/skills" element={<SkillPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/:id/view" element={<ProjctDetail />} />
            <Route path="projects/add" element={<ProjectAddUpdate />} />
            <Route path="projects/:id/edit" element={<ProjectAddUpdate />} />

            <Route path="skills" element={<SkillsList />} />
            <Route path="skills/:id/view" element={<SkillDetail />} />
            <Route path="skills/add" element={<AddAndUpdateSkill />} />
            <Route path="skills/:id/edit" element={<AddAndUpdateSkill />} />

            <Route path="services" element={<ServicesList />} />
            <Route path="services/add" element={<AddService />} />
            <Route path="services/:id/view" element={<ServiceDetail />} />

            <Route path="contacts" element={<ContactList />} />
            <Route path="contacts/:id/view" element={<ContactDetail />} />

            <Route path="profile" element={<ProfileDetail />} />
            <Route path="profile/:id/edit" element={<UpdateProfile />} />
          </Route>
        </Routes>
      </Suspense>
    </LayoutComponents>
  </Router>
);

export default React.memo(App);
