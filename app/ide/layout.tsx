import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

// IDE gets no padding — editor fills full remaining space
export default function IDELayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#07070f] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader />
        <main className="flex-1 overflow-hidden p-3">{children}</main>
      </div>
    </div>
  );
}
