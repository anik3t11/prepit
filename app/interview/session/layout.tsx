// interview/session is nested inside app/interview/layout.tsx which already
// provides Sidebar + DashboardHeader. No need to re-render the shell.
export default function InterviewSessionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
