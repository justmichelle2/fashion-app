import CustomerNav from "../components/CustomerNav";

export default function CustomerLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {children}
      <CustomerNav />
    </div>
  );
}
