// practice/[id] is nested inside app/practice/layout.tsx which already provides
// Sidebar + DashboardHeader. This layout only needs to undo the parent's p-6
// and make the editor fill the full remaining height.
export default function PracticeQuestionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      {children}
    </div>
  );
}
