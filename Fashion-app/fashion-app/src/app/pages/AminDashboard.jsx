import { ShieldCheck } from "lucide-react";

export default function AminDashboard() {
	return (
		<div className="min-h-screen bg-[#FAFAF8] px-6 py-10">
			<div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-[#E76F51]/10 p-8">
				<div className="flex items-center gap-3 mb-3">
					<ShieldCheck className="w-6 h-6 text-[#E76F51]" />
					<h1 className="text-2xl font-bold text-[#2D2D2D]">Admin Dashboard</h1>
				</div>
				<p className="text-[#6B6B6B]">Admin tools are loading. This page now exports a valid default component.</p>
			</div>
		</div>
	);
}
