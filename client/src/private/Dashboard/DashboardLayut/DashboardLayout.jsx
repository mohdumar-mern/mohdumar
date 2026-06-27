import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Container from "../../../components/UI/Container/Container";

const DashboardLayout = () => {
  return (
    <Container>
      <section className="min-h-[80vh] mt-10 w-full flex border border-cyan-500/15 overflow-hidden bg-black">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          <div className="border border-cyan-500/10 bg-gradient-to-b from-cyan-950/10 to-black p-6 min-h-[400px]">
            <Outlet />
          </div>
        </main>
      </section>
    </Container>
  );
};

export default DashboardLayout;