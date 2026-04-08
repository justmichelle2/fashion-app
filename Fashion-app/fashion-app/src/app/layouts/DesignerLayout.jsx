import DesignerNav from "../components/DesignerNav";

export default function DesignerLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {children}
      <DesignerNav />
    </div>
  );
}
