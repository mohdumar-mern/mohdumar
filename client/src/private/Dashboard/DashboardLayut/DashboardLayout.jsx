// pages/Dashboard/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Container from "../../../components/UI/Container/Container";

const DashboardLayout = () => {
  return (
    <Container>
      <section className="min-h-[80vh] mt-10  w-full flex rounded-xl overflow-hidden bg-black">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          <div className="bg-[#222] text-white rounded-xl shadow-md p-6 min-h-[400px]">
            <Outlet /> {/* Nested routes will render here */}
          </div>
        </main>
      </section>
    </Container>
  );
};

export default DashboardLayout;
