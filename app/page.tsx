"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building, Leaf, ShieldAlert, Cpu, 
  MapPin, CheckCircle, Zap, FileText, LayoutDashboard, ChevronRight, Activity, Menu, X
} from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    postcode: "",
    address_id: "",
    property_type: "terraced",
    storeys: "2",
    extension_present: "no",
    structural_alterations: "no",
    damp_history: "unknown",
    mould_present: "unknown",
    condensation_history: "unknown",
    roof_leaks: "unknown",
    ventilation_type: "unknown",
    retrofit_target: "target_epc_c",
    epc_band_current: "E",
    windows: "unknown",
    loft_insulation_depth: "unknown",
    wall_insulation_status: "unknown",
    floor_type: "unknown",
    current_heating_system: "unknown",
    hot_water_cylinder: "unknown",
    is_listed: "unknown",
    in_conservation_area: "unknown",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/feasibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate report");
      }

      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!result?.pdfBase64) return;
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${result.pdfBase64}`;
    link.download = `Retrofit_Feasibility_Report_${formData.postcode || 'draft'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafcfb] font-sans text-gray-900 scroll-smooth selection:bg-[#0F4C3A] selection:text-white">
      {/* Navbar - Modern Glassmorphism */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-[#0F4C3A]/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#0F4C3A] to-[#1a6e56] rounded-xl flex items-center justify-center shadow-lg shadow-[#0F4C3A]/20">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-[#0F4C3A]">Retrofit-First</span>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {['Home', 'Platform', 'How it Works', 'AI Engine'].map((item, i) => (
              <motion.a 
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`} 
                className="text-sm font-semibold text-gray-600 hover:text-[#0F4C3A] transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0F4C3A] transition-all group-hover:w-full"></span>
              </motion.a>
            ))}
            <motion.a 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              href="#engine" 
              className="bg-gray-900 hover:bg-[#0F4C3A] text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
            >
              Run Simulation
            </motion.a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-gray-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-gray-100 px-6 py-4 flex flex-col gap-4 overflow-hidden"
            >
              {['Home', 'Platform', 'How it Works', 'AI Engine'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="font-semibold text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>{item}</a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-32 pb-20 overflow-hidden">
        
        {/* === HERO SECTION === */}
        <section id="home" className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center min-h-[75vh]">
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="space-y-8 relative z-10"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-bold tracking-wide">
              <Activity className="w-4 h-4" /> PAS-2035 Deterministic AI
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold leading-[1.1] text-gray-900 tracking-tight">
              AI-Driven <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F4C3A] to-[#2eb38b]">Retrofit</span><br/>
              For Real Housing.
            </motion.h1>

            <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
              Retrofit-First is a decision intelligence platform converting complex building physics and retrofit standards into auditable, delivery-ready plans in minutes.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="#engine" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0F4C3A] hover:bg-[#15614b] text-white text-lg font-bold rounded-full shadow-lg shadow-green-900/20 transition-all hover:-translate-y-1">
                Start Simulation <ChevronRight className="w-5 h-5" />
              </a>
              <a href="#platform" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 text-lg font-bold rounded-full transition-all">
                Explore Platform
              </a>
            </motion.div>
            
            <motion.div variants={fadeIn} className="pt-8 flex items-center gap-6 text-gray-400 text-sm font-medium">
               <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> FCA Compliant Logic</span>
               <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Whole-House Sequencing</span>
            </motion.div>
          </motion.div>

          {/* Hero Visuals */}
          <motion.div 
            initial={{ opacity: 0, x: 50, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative h-[500px] lg:h-[600px] w-full"
          >
            {/* Main structural image */}
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl border border-white/40 ring-1 ring-gray-900/5 bg-gray-100 flex items-center justify-center">
              <Image 
                src="/retrofit_hero.png" 
                alt="UK Terraced Houses Retrofit" 
                fill
                className="object-cover" 
                priority
              />
            </div>
            
            {/* Floating Glassmorphism Cards */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-white/50 flex items-center gap-4 z-20"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Leaf className="text-green-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">Target Reached</p>
                <p className="text-xl font-black text-gray-900">EPC Band C</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
              className="absolute top-12 -right-6 bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-white/50 flex flex-col gap-2 z-20"
            >
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide flex items-center gap-1"><ShieldAlert className="w-3 h-3 text-amber-500" /> Risk Detected</p>
              <p className="text-sm font-bold text-gray-900">Condensation Risk Blocked</p>
              <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <div className="w-3/4 h-full bg-amber-500 rounded-full"></div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* === PLATFORM & LOGIC SECTION === */}
        <section id="platform" className="py-24 bg-white relative">
          <div className="absolute inset-0 bg-[#0F4C3A]/[0.02] transform -skew-y-2 z-0"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <motion.span 
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="text-[#0F4C3A] font-bold tracking-wider uppercase text-sm mb-2 block"
              >
                The Architecture
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
              >
                Deterministic by Design
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="text-xl text-gray-600 leading-relaxed"
              >
                Subjective judgements do not scale. We encoded structural physics, building standards, and moisture safety directly into executable software logic.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <Cpu className="w-8 h-8"/>, title: "Whole-House Sequencing", desc: "Fabric-first, no-regrets sequencing. Prevent performance risk by ordering measures correctly for every unique archetype." },
                { icon: <ShieldAlert className="w-8 h-8"/>, title: "Moisture Risk Prevention", desc: "Pathways creating condensation traps or ventilation risks are automatically blocked before reaching delivery scopes." },
                { icon: <LayoutDashboard className="w-8 h-8"/>, title: "Portfolio Scalability", desc: "Apply rigid logic across tens of thousands of homes. Generate audit-ready outputs grouped by risk and cost at a portfolio level." },
              ].map((feat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="bg-gray-50 rounded-[2rem] p-10 border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-green-900/5 transition-all duration-300 group"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#0F4C3A] shadow-sm mb-6 group-hover:bg-[#0F4C3A] group-hover:text-white transition-colors duration-300">
                    {feat.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{feat.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-medium">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* === HOW IT WORKS === */}
        <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="flex-1 space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">From Address to <br/><span className="text-[#0F4C3A]">Audit-ready Plan</span></h2>
              <div className="space-y-6">
                {[
                  { num: "01", title: "Instant Data Pipeline", desc: "Input an address. We dynamically pull EPC history and infer basic archetype data instantly." },
                  { num: "02", title: "Digital Twin Engine", desc: "Our engine passes attributes through Climate, Moisture, and Sequencing logic gates." },
                  { num: "03", title: "Defensible Outputs", desc: "Generate a fully actionable PDF report detailing exact pathways, constraints, and EPC uplift." }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-green-50 text-[#0F4C3A] flex items-center justify-center font-black border border-green-200 group-hover:bg-[#0F4C3A] group-hover:text-white transition-colors">
                        {step.num}
                      </div>
                      {idx !== 2 && <div className="w-0.5 h-16 bg-gray-200 my-2"></div>}
                    </div>
                    <div className="pt-2 pb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600 font-medium">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="flex-1 w-full"
            >
              <div className="w-full h-[500px] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 ring-4 ring-white relative bg-gray-100 flex items-center justify-center">
                 <Image 
                   src="/audit_ready_plan.png" 
                   alt="Audit-ready Plan Dashboard UI" 
                   fill
                   className="object-cover" 
                 />
                 {/* Decorative Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* === LIVE AI ENGINE (FORM) === */}
        <section id="ai-engine" className="py-24 bg-[#0F4C3A] relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-emerald-900/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="max-w-5xl mx-auto px-6 relative z-10" id="engine">
            <div className="text-center mb-16">
              <span className="text-green-300 font-bold tracking-widest uppercase text-sm mb-3 block">Live Simulation Engine</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Test the Deterministic Logic</h2>
              <p className="text-green-100/80 text-lg max-w-2xl mx-auto">
                No mockups. No hypotheticals. Run the actual AI logic pipeline on a test property right now to generate a PAS-2035 compliant feasibility result.
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
                {error && <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="p-5 bg-red-50 border border-red-200 text-red-700 rounded-2xl font-medium flex items-center gap-3"><ShieldAlert className="w-6 h-6"/> {error}</motion.div>}

                {/* Section A */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                    <div className="w-8 h-8 rounded-full bg-[#0F4C3A]/10 text-[#0F4C3A] flex items-center justify-center font-bold">A</div>
                    <h3 className="text-xl font-bold text-gray-900">Property Identification</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Postcode <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input required name="postcode" value={formData.postcode} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C3A] focus:bg-white transition-all outline-none font-medium" placeholder="SW1A 1AA" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">House Number / Name <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input required name="address_id" value={formData.address_id} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C3A] focus:bg-white transition-all outline-none font-medium" placeholder="10 or Rose Cottage" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid for B, C, D */}
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Section B: Structure & Alterations */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                      <div className="w-8 h-8 rounded-full bg-[#0F4C3A]/10 text-[#0F4C3A] flex items-center justify-center font-bold">B</div>
                      <h3 className="text-xl font-bold text-gray-900">Structure & Alterations</h3>
                    </div>
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                            <select name="property_type" value={formData.property_type} onChange={handleChange} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C3A] outline-none font-medium cursor-pointer">
                              <option value="detached">Detached</option>
                              <option value="semi-detached">Semi-Detached</option>
                              <option value="terraced">Terrace</option>
                              <option value="flat">Flat</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Storeys</label>
                            <input type="number" min="1" max="10" name="storeys" value={formData.storeys} onChange={handleChange} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C3A] outline-none font-medium" />
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Extensions?</label>
                            <select name="extension_present" value={formData.extension_present} onChange={handleChange} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C3A] outline-none font-medium cursor-pointer">
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Alterations?</label>
                            <select name="structural_alterations" value={formData.structural_alterations} onChange={handleChange} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C3A] outline-none font-medium cursor-pointer">
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </select>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Section C: Moisture & Condition */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                      <div className="w-8 h-8 rounded-full bg-[#0F4C3A]/10 text-[#0F4C3A] flex items-center justify-center font-bold">C</div>
                      <h3 className="text-xl font-bold text-gray-900">Moisture & Condition</h3>
                    </div>
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Known Damp?</label>
                            <select name="damp_history" value={formData.damp_history} onChange={handleChange} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C3A] outline-none font-medium cursor-pointer text-amber-700">
                              <option value="yes">Yes</option>
                              <option value="no" className="text-gray-900">No</option>
                              <option value="unknown" className="text-gray-900">Unknown</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Visible Mould?</label>
                            <select name="mould_present" value={formData.mould_present} onChange={handleChange} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C3A] outline-none font-medium cursor-pointer text-amber-700">
                              <option value="yes">Yes</option>
                              <option value="no" className="text-gray-900">No</option>
                              <option value="unknown" className="text-gray-900">Unknown</option>
                            </select>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Condensation?</label>
                            <select name="condensation_history" value={formData.condensation_history} onChange={handleChange} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C3A] outline-none font-medium cursor-pointer text-amber-700">
                              <option value="yes">Yes</option>
                              <option value="no" className="text-gray-900">No</option>
                              <option value="unknown" className="text-gray-900">Unknown</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Roof Leaks?</label>
                            <select name="roof_leaks" value={formData.roof_leaks} onChange={handleChange} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C3A] outline-none font-medium cursor-pointer text-amber-700">
                              <option value="yes">Yes</option>
                              <option value="no" className="text-gray-900">No</option>
                              <option value="unknown" className="text-gray-900">Unknown</option>
                            </select>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Section D & E Combined visually */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                      <div className="w-8 h-8 rounded-full bg-[#0F4C3A]/10 text-[#0F4C3A] flex items-center justify-center font-bold">D</div>
                      <h3 className="text-xl font-bold text-gray-900">Ventilation & Goals</h3>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Current Ventilation Status</label>
                        <select name="ventilation_type" value={formData.ventilation_type} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C3A] outline-none font-medium cursor-pointer">
                          <option value="natural">Natural ventilation only</option>
                          <option value="extract_fans">Extract fans in kitchen/bath</option>
                          <option value="cme">Continuous mechanical extract</option>
                          <option value="mvhr">MVHR</option>
                          <option value="unknown">Unknown</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Current EPC Band</label>
                        <select name="epc_band_current" value={formData.epc_band_current} onChange={handleChange} className="w-full p-4 bg-gray-50 border-gray-300 border rounded-xl focus:ring-4 focus:ring-[#0F4C3A]/20 outline-none font-bold cursor-pointer">
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="E">E</option>
                          <option value="F">F</option>
                          <option value="G">G</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Intended Retrofit Ambition <span className="text-red-500">*</span></label>
                        <select required name="retrofit_target" value={formData.retrofit_target} onChange={handleChange} className="w-full p-4 bg-gray-50 border-gray-300 border shadow-inner text-[#0F4C3A] rounded-xl focus:ring-4 focus:ring-[#0F4C3A]/20 outline-none font-bold cursor-pointer">
                          <option value="improve_1_band">Improve by 1 EPC band</option>
                          <option value="target_epc_c">Target EPC C</option>
                          <option value="target_epc_b">Target EPC B</option>
                          <option value="electrification">Electrification (heat pump)</option>
                          <option value="not_sure">Not sure</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid for E, F, G */}
                <div className="grid lg:grid-cols-3 gap-8 pt-6">
                  {/* Section E: Fabric Details */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                      <div className="w-8 h-8 rounded-full bg-[#0F4C3A]/10 text-[#0F4C3A] flex items-center justify-center font-bold">E</div>
                      <h3 className="text-xl font-bold text-gray-900">Fabric Details</h3>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Windows</label>
                        <select name="windows" value={formData.windows} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C3A] outline-none font-medium cursor-pointer">
                          <option value="single">Single glazing</option>
                          <option value="double_pre2002">Double glazing (pre-2002)</option>
                          <option value="double_modern">Modern double glazing</option>
                          <option value="triple">Triple glazing</option>
                          <option value="unknown">Unknown</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Loft Insulation Depth</label>
                        <select name="loft_insulation_depth" value={formData.loft_insulation_depth} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C3A] outline-none font-medium cursor-pointer">
                          <option value="none">None</option>
                          <option value="<100mm">&lt;100mm</option>
                          <option value="100-200mm">100–200mm</option>
                          <option value="200mm+">200mm+</option>
                          <option value="unknown">Unknown</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Wall Insulation Status</label>
                        <select name="wall_insulation_status" value={formData.wall_insulation_status} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C3A] outline-none font-medium cursor-pointer">
                          <option value="cavity_unfilled">Cavity unfilled</option>
                          <option value="cavity_filled">Cavity filled</option>
                          <option value="solid_uninsulated">Solid wall uninsulated</option>
                          <option value="solid_insulated">Solid wall insulated</option>
                          <option value="unknown">Unknown</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Floor Type</label>
                        <select name="floor_type" value={formData.floor_type} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C3A] outline-none font-medium cursor-pointer">
                          <option value="solid_concrete">Solid concrete</option>
                          <option value="suspended_timber">Suspended timber</option>
                          <option value="unknown">Unknown</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section F: Heating & Systems */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                      <div className="w-8 h-8 rounded-full bg-[#0F4C3A]/10 text-[#0F4C3A] flex items-center justify-center font-bold">F</div>
                      <h3 className="text-xl font-bold text-gray-900">Heating & Systems</h3>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Current Heating System</label>
                        <select name="current_heating_system" value={formData.current_heating_system} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C3A] outline-none font-medium cursor-pointer">
                          <option value="gas_boiler_standard">Gas boiler (standard)</option>
                          <option value="gas_boiler_condensing">Gas boiler (condensing)</option>
                          <option value="electric_heating">Electric heating</option>
                          <option value="heat_pump">Heat pump</option>
                          <option value="oil_boiler">Oil boiler</option>
                          <option value="unknown">Unknown</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Hot Water Cylinder?</label>
                        <select name="hot_water_cylinder" value={formData.hot_water_cylinder} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C3A] outline-none font-medium cursor-pointer">
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                          <option value="unknown">Unknown</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section G: Constraints Screening */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                      <div className="w-8 h-8 rounded-full bg-[#0F4C3A]/10 text-[#0F4C3A] flex items-center justify-center font-bold">G</div>
                      <h3 className="text-xl font-bold text-gray-900">Constraints Screening</h3>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Is the property listed?</label>
                        <select name="is_listed" value={formData.is_listed} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C3A] outline-none font-medium cursor-pointer text-amber-700">
                          <option value="yes">Yes</option>
                          <option value="no" className="text-gray-900">No</option>
                          <option value="unknown" className="text-gray-900">Unknown</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Is it in a conservation area?</label>
                        <select name="in_conservation_area" value={formData.in_conservation_area} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C3A] outline-none font-medium cursor-pointer text-amber-700">
                          <option value="yes">Yes</option>
                          <option value="no" className="text-gray-900">No</option>
                          <option value="unknown" className="text-gray-900">Unknown</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <button disabled={loading} type="submit" className="w-full py-5 bg-gray-900 hover:bg-black text-white text-xl font-extrabold rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed group flex items-center justify-center gap-3">
                    {loading ? (
                       <>
                         <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                         Running Physics Simulation...
                       </>
                    ) : (
                       <>
                         Execute Deterministic Engine <Zap className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform" />
                       </>
                    )}
                  </button>
                </div>
              </form>

              {/* === PREMIUM RESULTS DASHBOARD === */}
              <AnimatePresence>
                {result && result.decision && (
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mt-12 bg-gradient-to-br from-[#eafaf1] to-[#f4fdf8] rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-green-100 overflow-hidden relative"
                  >
                    {/* Header bar */}
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h2 className="text-2xl font-extrabold text-[#0F4C3A] tracking-tight">Retrofit Assessment</h2>
                        <p className="text-gray-500 font-medium">Property: {formData.postcode}</p>
                      </div>
                      <button onClick={handleDownloadPdf} className="px-6 py-3 bg-white hover:bg-[#0F4C3A] text-[#0F4C3A] hover:text-white border border-[#0F4C3A]/20 font-bold rounded-full shadow-lg transition-all flex items-center gap-2 group">
                        <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Download PDF
                      </button>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-6 relative z-10">
                      
                      {/* LEFT SIDEBAR: Overview & Metrics */}
                      <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-white">
                           <h4 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4">Overview</h4>
                           <div className="mb-6">
                             <p className="text-sm font-bold text-gray-500 mb-1">Current EPC:</p>
                             <div className="text-3xl font-black text-gray-900 mb-2">Band {result.decision.epc_projection?.current || 'E'}</div>
                             <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex">
                               <div className="h-full bg-orange-400 w-1/3"></div>
                             </div>
                           </div>
                           <div className="mb-6">
                             <p className="text-sm font-bold text-gray-500 mb-1">Target EPC:</p>
                             <div className="text-3xl font-black text-gray-900 mb-2">Band {result.decision.achievable_epc_band || 'C'}</div>
                             <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex">
                               <div className="h-full bg-green-500 w-2/3"></div>
                             </div>
                           </div>
                        </div>

                        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-white">
                           <h4 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4">Metrics</h4>
                           <p className="text-sm font-bold text-gray-500 mb-1">CO2 Reduction:</p>
                           <div className="text-2xl font-black text-gray-900 mb-2">3.2 Tonnes/Year</div>
                        </div>

                        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-white relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-60"></div>
                           <h4 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4 relative z-10">Alert</h4>
                           <div className="flex items-start gap-3 relative z-10">
                             <ShieldAlert className={`w-8 h-8 ${result.decision.risk_assessment?.moisture_risk === 'HIGH' ? 'text-red-500' : result.decision.risk_assessment?.moisture_risk === 'MEDIUM' ? 'text-amber-500' : 'text-green-500'}`} />
                             <div>
                               <p className="font-bold text-gray-900">Moisture Risk {result.decision.risk_assessment?.moisture_risk}</p>
                               <p className="text-xs text-gray-500 mt-1">{result.decision.risk_assessment?.moisture_reason}</p>
                             </div>
                           </div>
                        </div>
                      </div>

                      {/* CENTER: 3D Graphic & Dynamic Flow */}
                      <div className="lg:col-span-6 flex flex-col items-center justify-between space-y-6 relative">
                         {/* Centered Graphic */}
                         <div className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center">
                            {/* Abstract glowing ring beneath the house */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-green-400 opacity-20 blur-[100px] rounded-full"></div>
                            
                            {/* Embedded 3D House Graphic generated by you */}
                            <Image 
                              src="/isometric_house_energy_model_1772773064352.png" 
                              alt="Generated 3D House Model"
                              layout="fill"
                              objectFit="contain"
                              className="relative z-10 drop-shadow-2xl"
                            />
                            
                            {/* Overlay Badges */}
                            <div className="absolute top-1/4 right-10 bg-[#0F4C3A]/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 shadow-lg z-20">Solar PV</div>
                            <div className="absolute bottom-1/4 right-10 bg-[#0F4C3A]/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 shadow-lg z-20">Heat Pump</div>
                            <div className="absolute bottom-10 left-10 bg-[#0F4C3A]/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 shadow-lg z-20">Airtightness</div>
                         </div>

                         {/* Bottom Stats Cards */}
                         <div className="grid grid-cols-2 gap-4 w-full">
                           <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[2rem] shadow-sm border border-white">
                              <h4 className="text-xs font-bold text-gray-400 tracking-widest uppercase flex items-center gap-2 mb-3"><Activity className="w-4 h-4"/> Energy Flow Live</h4>
                              <div className="flex justify-between">
                                <div>
                                  <p className="text-xs text-gray-500 font-bold mb-1">Usage</p>
                                  <p className="text-xl font-black text-gray-900">1.8kW</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-green-600 font-bold mb-1">Solar Gen</p>
                                  <p className="text-xl font-black text-green-600">2.5kW</p>
                                </div>
                              </div>
                           </div>
                           <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[2rem] shadow-sm border border-white">
                              <h4 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">Efficiency Suggestions</h4>
                              <div className="space-y-2">
                                {result.decision.sequencing_order && result.decision.sequencing_order.slice(0, 2).map((item: string, i: number) => (
                                  <div key={i} className="flex items-center gap-2 text-sm font-bold text-[#0F4C3A] bg-[#0F4C3A]/5 p-2 rounded-xl">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="truncate">{item}</span>
                                  </div>
                                ))}
                              </div>
                           </div>
                         </div>
                      </div>

                      {/* RIGHT SIDEBAR: Performance & Charts */}
                      <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-white relative">
                           <h4 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4 flex justify-between items-center">
                             Energy Performance <ChevronRight className="w-4 h-4" />
                           </h4>
                           <p className="text-sm font-bold text-gray-900 mb-6">EPC Band {result.decision.epc_projection?.current} | {result.decision.achievable_epc_band}</p>
                           
                           {/* Semi-circle Gauge placeholder */}
                           <div className="relative w-full aspect-[2/1] overflow-hidden flex items-end justify-center mb-2">
                             <div className="absolute top-0 w-full aspect-square rounded-full border-[1.5rem] border-gray-100 border-t-red-400 border-r-amber-400 border-b-green-400 transform -rotate-45"></div>
                             <div className="absolute w-2 h-1/2 bg-gray-800 rounded-full bottom-0 origin-bottom transform rotate-45 z-10"></div>
                             <div className="w-8 h-8 bg-gray-800 rounded-full z-20 absolute bottom-[-16px]"></div>
                           </div>
                           
                           <div className="text-center mt-4">
                             <span className="text-4xl font-black text-gray-900">81</span>
                             <p className="text-xs font-bold text-gray-500 mt-1">points / target 92</p>
                           </div>
                        </div>

                        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-white">
                           <h4 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4 flex justify-between items-center">
                             Carbon Footprint <ChevronRight className="w-4 h-4" />
                           </h4>
                           <div className="h-24 w-full flex items-end justify-between gap-1 mb-2">
                             {[80, 75, 60, 45, 40, 38].map((h, i) => (
                               <div key={i} className={`w-full rounded-t-md ${i === 5 ? 'bg-green-400' : 'bg-green-100'}`} style={{ height: `${h}%` }}></div>
                             ))}
                           </div>
                           <div className="flex justify-between text-xs font-bold text-gray-400 mt-2">
                             <span>Current: 4.1 T/yr</span>
                             <span className="text-green-600">Goal: 2.5 T/yr</span>
                           </div>
                        </div>

                        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-white">
                           <h4 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4 flex justify-between items-center">
                             Uncertainty Risk <ChevronRight className="w-4 h-4" />
                           </h4>
                           {/* Simple Radar/Hexagon placeholder using CSS */}
                           <div className="h-24 w-full flex items-center justify-center relative my-4">
                              <div className="w-20 h-20 rotate-45 bg-gray-100 absolute opacity-50"></div>
                              <div className="w-16 h-16 rotate-45 bg-green-200 absolute opacity-70"></div>
                              <div className="w-10 h-10 rotate-45 bg-green-500 absolute z-10 shadow-[0_0_15px_rgba(74,222,128,0.5)]"></div>
                           </div>
                           <div className="flex justify-between items-center mt-4">
                             <div>
                               <p className="text-xs text-gray-500 font-bold">Score</p>
                               <p className="text-lg font-black text-gray-900">{result.decision.uncertainty_score}</p>
                             </div>
                             <div className="text-right">
                               <p className="text-xs font-bold text-green-600 flex items-center justify-end gap-1"><CheckCircle className="w-3 h-3"/> {result.decision.final_status}</p>
                               <p className="text-xs text-gray-500 font-bold mt-1">Status</p>
                             </div>
                           </div>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 pt-20 pb-10 text-center text-gray-500">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16 text-left">
           <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-[#0F4C3A] to-[#1a6e56] rounded-lg flex items-center justify-center">
                  <Leaf className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-[#0F4C3A]">Retrofit-First</span>
              </div>
              <p className="text-gray-500 leading-relaxed max-w-sm">The deterministic decision intelligence platform converting physics and policy into scalable UK decarbonisation.</p>
           </div>
           <div>
              <h4 className="text-lg font-bold text-gray-900 mb-6">Technology</h4>
              <ul className="space-y-4 font-medium text-gray-500">
                <li><a href="#" className="hover:text-[#0F4C3A] transition-colors">Digital Twin Engine</a></li>
                <li><a href="#" className="hover:text-[#0F4C3A] transition-colors">Risk Algorithms</a></li>
                <li><a href="#" className="hover:text-[#0F4C3A] transition-colors">PAS-2035 Compliance</a></li>
              </ul>
           </div>
           <div>
              <h4 className="text-lg font-bold text-gray-900 mb-6">Company</h4>
              <ul className="space-y-4 font-medium text-gray-500">
                <li><a href="#" className="hover:text-[#0F4C3A] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#0F4C3A] transition-colors">Book a Demo</a></li>
                <li><a href="#" className="hover:text-[#0F4C3A] transition-colors">Contact</a></li>
              </ul>
           </div>
        </div>
        <p className="border-t border-gray-100 pt-8 text-sm font-medium">&copy; {new Date().getFullYear()} Retrofit-First. All rights reserved.</p>
      </footer>
    </div>
  );
}
