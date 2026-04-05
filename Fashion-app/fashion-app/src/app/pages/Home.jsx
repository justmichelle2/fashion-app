import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { Search, MapPin, Star } from "lucide-react";
import { auth } from "../firebase";
import { mockDesigners } from "../data/mockData";
import { getUserRole } from "../utils/authRedirect";

export default function Home() {
  const navigate = useNavigate();
  const [designers, setDesigners] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (cancelled) return;

      if (!user) {
        navigate("/login/customer", { replace: true });
        return;
      }

      try {
        const role = await getUserRole(user.uid);
        if (cancelled) return;

        if (role === "Designer") {
          navigate("/designer-home", { replace: true });
          return;
        }

        setDesigners(mockDesigners);
        setFiltered(mockDesigners);
      } catch (err) {
        if (!cancelled) {
          console.error("Error checking role:", err);
          setError("Failed to load page");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [navigate]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const results = designers.filter((d) =>
      d.name.toLowerCase().includes(term.toLowerCase()) ||
      d.specialties.some((s) => s.toLowerCase().includes(term.toLowerCase()))
    );
    setFiltered(results);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#E76F51] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#6B6B6B] font-['Raleway'] text-sm">Loading...</p>
          </div>
        </div>
      ) : error ? (
        <div className="p-6 mt-10">
          <div className="bg-red-500/15 border border-red-500/30 rounded-lg p-4 text-center">
            <p className="text-red-700 font-['Raleway']">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-['Raleway'] hover:bg-red-600 transition"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="sticky top-0 z-20 bg-white shadow-sm p-6 space-y-4">
            <div>
              <h1 className="text-[#2D2D2D] text-2xl font-bold font-['Playfair_Display']">Designers</h1>
              <p className="text-[#6B6B6B] text-sm font-['Raleway']">Find your perfect designer</p>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#6B6B6B]" />
              <input
                type="text"
                placeholder="Search designers..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-[#F5E6D3]/30 text-[#2D2D2D] placeholder-[#6B6B6B]/60 rounded-full p-3 pl-12 border border-[#E76F51]/20 focus:border-[#E76F51] focus:outline-none"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => {
                  setFilter("all");
                  setFiltered(designers);
                }}
                className={`px-4 py-2 rounded-full text-sm font-['Raleway'] font-semibold transition whitespace-nowrap ${
                  filter === "all"
                    ? "bg-[#E76F51] text-white"
                    : "bg-white text-[#6B6B6B] border border-[#E76F51]/20 hover:border-[#E76F51]"
                }`}
              >
                All
              </button>
              {["Wedding", "Casual", "Corporate"].map((spec) => (
                <button
                  key={spec}
                  onClick={() => {
                    setFilter(spec);
                    const results = designers.filter((d) => d.specialties.includes(spec));
                    setFiltered(results);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-['Raleway'] font-semibold transition whitespace-nowrap ${
                    filter === spec
                      ? "bg-[#E76F51] text-white"
                      : "bg-white text-[#6B6B6B] border border-[#E76F51]/20 hover:border-[#E76F51]"
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-4">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#6B6B6B] font-['Raleway']">No designers found</p>
              </div>
            ) : (
              filtered.map((designer) => (
                <button
                  key={designer.id}
                  onClick={() => navigate(`/designer/${designer.id}`)}
                  className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition text-left border border-[#E76F51]/10 hover:border-[#E76F51]/30"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-[#E76F51] to-[#F4A261] flex-shrink-0 flex items-center justify-center">
                      <span className="text-3xl">👨‍🎨</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-[#2D2D2D] font-semibold font-['Raleway']">{designer.name}</h3>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4 text-[#6B6B6B]" />
                            <span className="text-[#6B6B6B] text-sm font-['Raleway']">{designer.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-[#F5E6D3] px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 text-[#E76F51]" />
                          <span className="text-[#2D2D2D] text-sm font-semibold">{designer.rating}</span>
                        </div>
                      </div>

                      <p className="text-[#6B6B6B] text-sm font-['Raleway'] mt-2 line-clamp-2">{designer.bio}</p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {designer.specialties.slice(0, 3).map((spec) => (
                          <span
                            key={spec}
                            className="text-xs bg-[#E76F51]/10 text-[#E76F51] px-3 py-1 rounded-full font-['Raleway']"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
