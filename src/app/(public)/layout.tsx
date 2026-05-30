import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </>
  );
}
