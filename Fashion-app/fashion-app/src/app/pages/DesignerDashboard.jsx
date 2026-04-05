import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  Images,
  Ruler,
  FolderKanban,
  Timer,
  Wallet,
  Plus,
  Trash2,
  CircleDollarSign,
} from "lucide-react";
import {
  addMeasurement,
  addPortfolioItem,
  addProject,
  formatCurrency,
  getCurrentDesigner,
  getEarningsSummary,
  removePortfolioItem,
  toggleProjectPayment,
  updateProjectStatus,
} from "../data/mockData";

const statusLabels = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

export default function DesignerDashboard() {
  const [designer, setDesigner] = useState(() => getCurrentDesigner());

  const [portfolioForm, setPortfolioForm] = useState({ title: "", category: "", imageUrl: "" });
  const [measurementForm, setMeasurementForm] = useState({
    clientName: "",
    garmentType: "",
    chest: "",
    waist: "",
    hips: "",
    inseam: "",
    notes: "",
  });
  const [projectForm, setProjectForm] = useState({
    title: "",
    clientName: "",
    dueDate: "",
    amount: "",
    status: "pending",
    paid: false,
    description: "",
  });

  if (!designer) {
    return <Navigate to="/designer-login" replace />;
  }

  const earnings = getEarningsSummary(designer);

  const projectStats = useMemo(() => {
    const total = designer.projects.length;
    const pending = designer.projects.filter((project) => project.status === "pending").length;
    const inProgress = designer.projects.filter((project) => project.status === "in_progress").length;
    const completed = designer.projects.filter((project) => project.status === "completed").length;
    return { total, pending, inProgress, completed };
  }, [designer.projects]);

  const refreshDesigner = (nextDesigner) => {
    setDesigner(nextDesigner);
  };

  const handlePortfolioSubmit = (event) => {
    event.preventDefault();
    if (!portfolioForm.title || !portfolioForm.category || !portfolioForm.imageUrl) return;

    const next = addPortfolioItem(designer.id, portfolioForm);
    refreshDesigner(next);
    setPortfolioForm({ title: "", category: "", imageUrl: "" });
  };

  const handleMeasurementSubmit = (event) => {
    event.preventDefault();
    if (!measurementForm.clientName || !measurementForm.garmentType) return;

    const next = addMeasurement(designer.id, measurementForm);
    refreshDesigner(next);
    setMeasurementForm({
      clientName: "",
      garmentType: "",
      chest: "",
      waist: "",
      hips: "",
      inseam: "",
      notes: "",
    });
  };

  const handleProjectSubmit = (event) => {
    event.preventDefault();
    if (!projectForm.title || !projectForm.clientName || !projectForm.dueDate || !projectForm.amount) return;

    const next = addProject(designer.id, projectForm);
    refreshDesigner(next);
    setProjectForm({
      title: "",
      clientName: "",
      dueDate: "",
      amount: "",
      status: "pending",
      paid: false,
      description: "",
    });
  };

  const sectionCards = [
    { label: "Portfolio", value: designer.portfolio.length, icon: <Images className="w-5 h-5" />, color: "bg-[#FFF5EE]" },
    { label: "Measurements", value: designer.measurements.length, icon: <Ruler className="w-5 h-5" />, color: "bg-[#EFF6FF]" },
    { label: "Projects", value: designer.projects.length, icon: <FolderKanban className="w-5 h-5" />, color: "bg-[#F0FDF4]" },
    { label: "In Progress", value: projectStats.inProgress, icon: <Timer className="w-5 h-5" />, color: "bg-[#FFF7ED]" },
    { label: "Paid Earnings", value: formatCurrency(earnings.paid), icon: <Wallet className="w-5 h-5" />, color: "bg-[#F5F3FF]" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-[#F8EFE7] px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <section className="bg-white rounded-3xl p-6 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#2D2D2D]">Designer Dashboard</h1>
              <p className="text-gray-600 mt-1">
                {designer.name} - {designer.specialty} - {designer.location}
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/designer-profile" className="px-4 py-2 rounded-xl border border-[#2D2D2D] text-[#2D2D2D]">
                My Profile
              </Link>
              <Link to="/designer-home" className="px-4 py-2 rounded-xl border border-[#2D2D2D] text-[#2D2D2D]">
                Designer Home
              </Link>
              <Link to="/designer-list" className="px-4 py-2 rounded-xl bg-[#2D2D2D] text-white">
                View Designers
              </Link>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-5 mt-5">
            {sectionCards.map((card) => (
              <div key={card.label} className={`rounded-xl p-4 ${card.color}`}>
                <div className="text-[#2D2D2D]">{card.icon}</div>
                <p className="text-xs uppercase tracking-wide text-gray-600 mt-2">{card.label}</p>
                <p className="text-lg font-semibold text-[#2D2D2D] mt-1">{card.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#2D2D2D]">Portfolio Management</h2>
              <Images className="w-5 h-5 text-[#E76F51]" />
            </div>

            <form onSubmit={handlePortfolioSubmit} className="grid gap-2 mt-4">
              <input
                value={portfolioForm.title}
                onChange={(event) => setPortfolioForm((previous) => ({ ...previous, title: event.target.value }))}
                className="border rounded-xl p-2.5"
                placeholder="Design title"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  value={portfolioForm.category}
                  onChange={(event) => setPortfolioForm((previous) => ({ ...previous, category: event.target.value }))}
                  className="border rounded-xl p-2.5"
                  placeholder="Category"
                />
                <input
                  value={portfolioForm.imageUrl}
                  onChange={(event) => setPortfolioForm((previous) => ({ ...previous, imageUrl: event.target.value }))}
                  className="border rounded-xl p-2.5"
                  placeholder="Image URL"
                />
              </div>
              <button type="submit" className="inline-flex items-center justify-center gap-2 bg-[#E76F51] text-white rounded-xl py-2.5">
                <Plus className="w-4 h-4" />
                Add Portfolio Item
              </button>
            </form>

            <div className="space-y-3 mt-4 max-h-72 overflow-y-auto pr-1">
              {designer.portfolio.map((item) => (
                <div key={item.id} className="flex gap-3 p-2 border rounded-xl">
                  <img src={item.imageUrl} alt={item.title} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                  <div className="flex-1">
                    <p className="font-medium text-[#2D2D2D]">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => refreshDesigner(removePortfolioItem(designer.id, item.id))}
                    className="self-start text-red-600 hover:text-red-700"
                    aria-label="Delete portfolio item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </article>

          <article className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#2D2D2D]">Measurements and Specs</h2>
              <Ruler className="w-5 h-5 text-blue-600" />
            </div>

            <form onSubmit={handleMeasurementSubmit} className="grid gap-2 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  value={measurementForm.clientName}
                  onChange={(event) => setMeasurementForm((previous) => ({ ...previous, clientName: event.target.value }))}
                  className="border rounded-xl p-2.5"
                  placeholder="Client name"
                />
                <input
                  value={measurementForm.garmentType}
                  onChange={(event) => setMeasurementForm((previous) => ({ ...previous, garmentType: event.target.value }))}
                  className="border rounded-xl p-2.5"
                  placeholder="Garment type"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <input value={measurementForm.chest} onChange={(event) => setMeasurementForm((previous) => ({ ...previous, chest: event.target.value }))} className="border rounded-xl p-2.5" placeholder="Chest" />
                <input value={measurementForm.waist} onChange={(event) => setMeasurementForm((previous) => ({ ...previous, waist: event.target.value }))} className="border rounded-xl p-2.5" placeholder="Waist" />
                <input value={measurementForm.hips} onChange={(event) => setMeasurementForm((previous) => ({ ...previous, hips: event.target.value }))} className="border rounded-xl p-2.5" placeholder="Hips" />
                <input value={measurementForm.inseam} onChange={(event) => setMeasurementForm((previous) => ({ ...previous, inseam: event.target.value }))} className="border rounded-xl p-2.5" placeholder="Inseam" />
              </div>
              <textarea rows={2} value={measurementForm.notes} onChange={(event) => setMeasurementForm((previous) => ({ ...previous, notes: event.target.value }))} className="border rounded-xl p-2.5" placeholder="Specifications and notes" />
              <button type="submit" className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white rounded-xl py-2.5">
                <Plus className="w-4 h-4" />
                Save Measurement
              </button>
            </form>

            <div className="space-y-2 mt-4 max-h-72 overflow-y-auto pr-1">
              {designer.measurements.map((record) => (
                <div key={record.id} className="border rounded-xl p-3 text-sm">
                  <p className="font-semibold text-[#2D2D2D]">{record.clientName} - {record.garmentType}</p>
                  <p className="text-gray-600 mt-1">
                    C:{record.chest || "-"} / W:{record.waist || "-"} / H:{record.hips || "-"} / I:{record.inseam || "-"}
                  </p>
                  {record.notes ? <p className="text-gray-500 mt-1">{record.notes}</p> : null}
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#2D2D2D]">Project Creation and Management</h2>
              <FolderKanban className="w-5 h-5 text-green-600" />
            </div>

            <form onSubmit={handleProjectSubmit} className="grid gap-2 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input value={projectForm.title} onChange={(event) => setProjectForm((previous) => ({ ...previous, title: event.target.value }))} className="border rounded-xl p-2.5" placeholder="Project title" />
                <input value={projectForm.clientName} onChange={(event) => setProjectForm((previous) => ({ ...previous, clientName: event.target.value }))} className="border rounded-xl p-2.5" placeholder="Client name" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <input type="date" value={projectForm.dueDate} onChange={(event) => setProjectForm((previous) => ({ ...previous, dueDate: event.target.value }))} className="border rounded-xl p-2.5" />
                <input type="number" value={projectForm.amount} onChange={(event) => setProjectForm((previous) => ({ ...previous, amount: event.target.value }))} className="border rounded-xl p-2.5" placeholder="Amount" min="0" />
                <select value={projectForm.status} onChange={(event) => setProjectForm((previous) => ({ ...previous, status: event.target.value }))} className="border rounded-xl p-2.5">
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <label className="inline-flex items-center gap-2 text-sm border rounded-xl px-3">
                  <input type="checkbox" checked={projectForm.paid} onChange={(event) => setProjectForm((previous) => ({ ...previous, paid: event.target.checked }))} />
                  Paid
                </label>
              </div>

              <textarea rows={2} value={projectForm.description} onChange={(event) => setProjectForm((previous) => ({ ...previous, description: event.target.value }))} className="border rounded-xl p-2.5" placeholder="Project notes" />

              <button type="submit" className="inline-flex items-center justify-center gap-2 bg-green-600 text-white rounded-xl py-2.5">
                <Plus className="w-4 h-4" />
                Create Project
              </button>
            </form>

            <div className="space-y-2 mt-4 max-h-72 overflow-y-auto pr-1">
              {designer.projects.map((project) => (
                <div key={project.id} className="border rounded-xl p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#2D2D2D]">{project.title}</p>
                      <p className="text-sm text-gray-600">{project.clientName} - Due {project.dueDate}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#2D2D2D]">{formatCurrency(project.amount)}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <select
                      value={project.status}
                      onChange={(event) => refreshDesigner(updateProjectStatus(designer.id, project.id, event.target.value))}
                      className="text-sm border rounded-lg px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => refreshDesigner(toggleProjectPayment(designer.id, project.id))}
                      className={`text-sm px-2 py-1 rounded-lg ${
                        project.paid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {project.paid ? "Paid" : "Mark Paid"}
                    </button>
                    {project.description ? <p className="text-xs text-gray-500">{project.description}</p> : null}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#2D2D2D]">WIP and Earnings Tracking</h2>
              <CircleDollarSign className="w-5 h-5 text-violet-600" />
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="rounded-xl bg-[#FFF7ED] p-3">
                <p className="text-xs text-gray-600">Pending</p>
                <p className="text-xl font-semibold text-[#2D2D2D]">{projectStats.pending}</p>
              </div>
              <div className="rounded-xl bg-[#EFF6FF] p-3">
                <p className="text-xs text-gray-600">In Progress</p>
                <p className="text-xl font-semibold text-[#2D2D2D]">{projectStats.inProgress}</p>
              </div>
              <div className="rounded-xl bg-[#F0FDF4] p-3">
                <p className="text-xs text-gray-600">Completed</p>
                <p className="text-xl font-semibold text-[#2D2D2D]">{projectStats.completed}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border p-4">
              <p className="text-sm text-gray-600">Total earnings</p>
              <p className="text-2xl font-bold text-[#2D2D2D] mt-1">{formatCurrency(earnings.total)}</p>
              <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                <div>
                  <p className="text-gray-500">Paid</p>
                  <p className="font-semibold text-green-700">{formatCurrency(earnings.paid)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Pending</p>
                  <p className="font-semibold text-amber-700">{formatCurrency(earnings.pending)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4 max-h-72 overflow-y-auto pr-1">
              {designer.projects.map((project) => (
                <div key={project.id} className="rounded-xl border p-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-[#2D2D2D]">{project.title}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      {statusLabels[project.status]}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{project.clientName}</p>
                  <p className="text-[#2D2D2D] font-semibold mt-1">{formatCurrency(project.amount)}</p>
                  <p className={`mt-1 ${project.paid ? "text-green-700" : "text-amber-700"}`}>
                    {project.paid ? "Payment received" : "Awaiting payment"}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
