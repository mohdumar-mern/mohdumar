// import { Outlet } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import Container from "../../../components/UI/Container/Container";

// const DashboardLayout = () => {
//   return (
//     <Container>
//       <section className="min-h-[80vh] mt-10 w-full flex border border-cyan-500/15 overflow-hidden bg-black">
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Main Content */}
//         <main className="flex-1 p-4 sm:p-6">
//           <div className="border border-cyan-500/10 bg-gradient-to-b from-cyan-950/10 to-black p-6 min-h-[400px]">
//             <Outlet />
//           </div>
//         </main>
//       </section>
//     </Container>
//   );
// };

// export default DashboardLayout;
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import Sidebar from "./Sidebar";
import Container from "../../../components/UI/Container/Container";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer after navigating to another page.
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Prevent the page behind the mobile drawer from scrolling.
  useEffect(() => {
    if (!drawerOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawerOpen]);

  return (
    <Container>
      <section className="my-4 flex min-h-[calc(100dvh-2rem)] w-full min-w-0 max-w-full overflow-hidden border border-cyan-500/15 bg-black font-mono sm:my-6 lg:my-8">
        {/* Desktop sidebar: expanded or icon-only */}
        <aside
          className={`relative hidden shrink-0 border-r border-cyan-500/15 bg-black transition-[width] duration-200 md:block ${
            collapsed ? "w-[76px]" : "w-64 xl:w-72"
          }`}
        >
          <div className="flex h-14 items-center justify-end border-b border-cyan-500/10 px-3">
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className="inline-flex h-9 w-9 items-center justify-center border border-cyan-500/20 text-gray-400 transition hover:border-cyan-400 hover:text-cyan-300"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          </div>
          <Sidebar collapsed={collapsed} />
        </aside>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-[100] md:hidden" role="presentation">
            <button
              type="button"
              className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation menu"
            />
            <aside
              className="absolute inset-y-0 left-0 flex w-[min(19rem,85vw)] max-w-full flex-col overflow-y-auto border-r border-cyan-400/25 bg-black shadow-2xl shadow-cyan-950/40"
              role="dialog"
              aria-modal="true"
              aria-label="Dashboard navigation"
            >
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-cyan-500/15 px-4">
                <span className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                  Admin navigation
                </span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center border border-cyan-500/20 text-gray-300 hover:border-cyan-400 hover:text-cyan-300"
                  aria-label="Close navigation"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <Sidebar mobile />
            </aside>
          </div>
        )}

        {/* Main content must be allowed to shrink; tables scroll inside their own wrapper */}
        <main className="min-w-0 flex-1 overflow-x-hidden bg-black p-3 sm:p-4 lg:p-6">
          <div className="min-h-[400px] w-full min-w-0 max-w-full border border-cyan-500/10 bg-gradient-to-b from-cyan-950/10 to-black p-3 sm:p-5 lg:p-6">
            <div className="mb-4 flex items-center justify-between md:hidden">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex min-h-10 items-center gap-2 border border-cyan-500/25 px-3 text-xs uppercase tracking-widest text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-500/10"
                aria-label="Open dashboard navigation"
              >
                <Menu className="h-4 w-4" />
                Menu
              </button>
              <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
                Admin panel
              </span>
            </div>
            <div className="w-full min-w-0 max-w-full">
              <Outlet />
            </div>
          </div>
        </main>
      </section>
    </Container>
  );
};

export default DashboardLayout;
