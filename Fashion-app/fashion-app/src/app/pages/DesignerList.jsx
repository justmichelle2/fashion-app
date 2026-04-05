<<<<<<< Updated upstream
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, MessageCircle, Heart } from "lucide-react";
import { mockDesigners } from "../data/mockData";

export default function DesignerList() {
  const navigate = useNavigate();
  const [liked, setLiked] = useState({});

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      <div className="sticky top-0 z-20 bg-white shadow-sm p-6">
        <h1 className="text-[#2D2D2D] text-2xl font-bold font-['Playfair_Display']">Top Designers</h1>
        <p className="text-[#6B6B6B] text-sm font-['Raleway']">Curated collection of Ghana's best</p>
      </div>

      <div className="p-6 space-y-3">
        {mockDesigners.map((designer) => (
          <div key={designer.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-[#E76F51]/10">
            {/* Designer Card Header - Clickable */}
            <button
              onClick={() => navigate(`/designer/${designer.id}`)}
              className="p-4 w-full text-left"
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#E76F51] to-[#F4A261] flex-shrink-0 flex items-center justify-center text-2xl">
                  👨‍🎨
                </div>

                <div className="flex-1">
                  <h3 className="text-[#2D2D2D] font-bold text-lg font-['Raleway']">{designer.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-[#6B6B6B]" />
                    <span className="text-[#6B6B6B] text-xs font-['Raleway']">{designer.location}</span>
                    <div className="flex items-center gap-1 ml-auto bg-[#F5E6D3] px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 text-[#E76F51]" />
                      <span className="text-[#2D2D2D] text-xs font-semibold">{designer.rating}</span>
                    </div>
                  </div>
                  <p className="text-[#6B6B6B] text-xs font-['Raleway'] mt-2 line-clamp-2">{designer.bio}</p>
                </div>
              </div>
            </button>

            {/* Action Buttons */}
            <div className="flex gap-2 p-4 pt-0 border-t border-[#E76F51]/10">
              <button
                onClick={() => navigate(`/chat/${designer.id}`)}
                className="flex-1 flex items-center justify-center gap-2 h-10 bg-gradient-to-r from-[#E76F51] to-[#F4A261] hover:from-[#D55B3A] hover:to-[#DB9149] text-white rounded-lg font-['Raleway'] font-semibold text-sm transition"
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </button>

              <button
                onClick={() => toggleLike(designer.id)}
                className={`flex-1 h-10 rounded-lg border-2 transition font-['Raleway'] font-semibold text-sm ${
                  liked[designer.id]
                    ? "bg-red-50 border-red-500 text-red-600"
                    : "border-[#E76F51]/20 text-[#6B6B6B] hover:border-[#E76F51]"
                }`}
              >
                <Heart className={`w-4 h-4 mx-auto ${liked[designer.id] ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
=======
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Star, Scissors, BriefcaseBusiness, Wallet } from "lucide-react";
import { formatCurrency, getEarningsSummary, loadDesigners } from "../data/mockData";

export default function DesignerList() {
	const [query, setQuery] = useState("");
	const designers = loadDesigners();

	const filteredDesigners = useMemo(() => {
		const text = query.trim().toLowerCase();
		if (!text) return designers;

		return designers.filter((designer) => {
			const haystack = `${designer.name} ${designer.specialty} ${designer.location}`.toLowerCase();
			return haystack.includes(text);
		});
	}, [designers, query]);

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-[#F8EFE7] px-4 py-8">
			<div className="max-w-5xl mx-auto">
				<div className="flex flex-wrap items-center justify-between gap-3 mb-5">
					<div>
						<h1 className="text-3xl font-bold text-[#2D2D2D]">Designer Directory</h1>
						<p className="text-gray-600">Browse active designers and current workload insights.</p>
					</div>
					<Link to="/designer-home" className="px-4 py-2 rounded-xl border border-[#2D2D2D] text-[#2D2D2D]">
						Back to Home
					</Link>
				</div>

				<div className="bg-white rounded-2xl p-4 shadow-sm mb-5">
					<div className="relative">
						<Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
						<input
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							className="w-full border rounded-xl py-2.5 pl-10 pr-3"
							placeholder="Search by name, specialty, or city"
						/>
					</div>
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					{filteredDesigners.map((designer) => {
						const activeProjects = designer.projects.filter((project) => project.status === "in_progress").length;
						const earnings = getEarningsSummary(designer);

						return (
							<article key={designer.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
								<div className="flex items-start justify-between gap-3">
									<div>
										<h2 className="text-xl font-semibold text-[#2D2D2D]">{designer.name}</h2>
										<p className="text-sm text-gray-600 mt-1">{designer.specialty}</p>
										<p className="text-xs text-gray-500 mt-1">{designer.location}</p>
									</div>
									<span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
										<Star className="w-4 h-4" />
										{designer.rating?.toFixed(1) ?? "4.5"}
									</span>
								</div>

								<p className="text-sm text-gray-700 mt-3">{designer.bio || "No bio added yet."}</p>

								<div className="grid grid-cols-3 gap-2 mt-4 text-sm">
									<div className="rounded-xl bg-[#FFF5EE] p-3">
										<p className="text-xs text-gray-600">Portfolio</p>
										<p className="font-semibold text-[#2D2D2D] mt-1 inline-flex items-center gap-1">
											<Scissors className="w-4 h-4" />
											{designer.portfolio.length}
										</p>
									</div>
									<div className="rounded-xl bg-[#EFF6FF] p-3">
										<p className="text-xs text-gray-600">Active</p>
										<p className="font-semibold text-[#2D2D2D] mt-1 inline-flex items-center gap-1">
											<BriefcaseBusiness className="w-4 h-4" />
											{activeProjects}
										</p>
									</div>
									<div className="rounded-xl bg-[#F0FDF4] p-3">
										<p className="text-xs text-gray-600">Paid</p>
										<p className="font-semibold text-[#2D2D2D] mt-1 inline-flex items-center gap-1">
											<Wallet className="w-4 h-4" />
											{formatCurrency(earnings.paid)}
										</p>
									</div>
								</div>
							</article>
						);
					})}
				</div>

				{filteredDesigners.length === 0 ? (
					<div className="bg-white rounded-2xl p-6 shadow-sm text-center text-gray-600 mt-4">
						No designers found for this search.
					</div>
				) : null}
			</div>
		</div>
	);
>>>>>>> Stashed changes
}
