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
                   src="/retrofit_dashboard.png" 
                   alt="Dashboard UI" 
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

              {/* === INLINE RESULTS VIEW === */}
              <AnimatePresence>
                {result && result.decision && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-[#fbfcfa] border-t-2 border-green-50 overflow-hidden"
                  >
                    <div className="p-8 md:p-12">
                      <div className="flex flex-col md:flex-row items-center justify-between mb-10 pb-6 border-b border-gray-100">
                        <div>
                           <h2 className="text-3xl font-extrabold text-[#0F4C3A] flex items-center gap-3">
                              <CheckCircle className="w-8 h-8 text-green-500" /> Assessment Complete
                           </h2>
                           <p className="text-gray-500 mt-2 font-medium">Deterministic pipeline successfully processed {formData.postcode}</p>
                        </div>
                        <div className={`mt-6 md:mt-0 px-8 py-3 rounded-full font-black text-tracking-widest text-lg text-white shadow-lg flex items-center gap-2 ${
                          result.decision.final_status === 'GREEN' ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-green-500/30' :
                          result.decision.final_status === 'AMBER' ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-amber-500/30' : 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/30'
                        }`}>
                          {result.decision.final_status} PATHWAY STATUS
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8 mb-10">
                        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-green-50 to-green-100 flex items-center justify-center border border-green-200">
                             <Leaf className="w-8 h-8 text-green-600"/>
                          </div>
                          <div>
                            <h4 className="text-gray-400 font-bold mb-1 uppercase text-xs tracking-wider">Target Achieved</h4>
                            <p className="text-4xl font-black text-gray-900">EPC {result.decision.achievable_epc_band}</p>
                          </div>
                        </div>
                        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-50 to-blue-100 flex items-center justify-center border border-blue-200">
                             <Activity className="w-8 h-8 text-blue-600"/>
                          </div>
                          <div>
                            <h4 className="text-gray-400 font-bold mb-1 uppercase text-xs tracking-wider">Uncertainty Risk</h4>
                            <p className="text-4xl font-black text-gray-900">{result.decision.uncertainty_score} <span className="text-xl font-medium text-gray-400">/ 100</span></p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-gray-100">
                          <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                             <div className="bg-gray-100 p-2 rounded-lg text-gray-600"><Cpu className="w-5 h-5"/></div> Correct Sequencing
                          </h4>
                          {result.decision.sequencing_order?.length > 0 ? (
                            <div className="grid gap-3">
                              {result.decision.sequencing_order.map((item: string, i: number) => (
                                <div key={i} className="flex flex-row items-center gap-5 p-2 pr-6 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                                   <div className="w-10 h-10 rounded-full bg-[#0F4C3A] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md">0{i+1}</div>
                                   <div className="font-bold text-gray-800 text-lg">{item}</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 font-medium p-6 bg-gray-50 rounded-2xl text-center">No measures recommended for this pathway.</p>
                          )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-amber-50/40 p-8 rounded-[1.5rem] border border-amber-200">
                            <h4 className="text-lg font-bold text-amber-900 mb-5 flex items-center gap-2"><ShieldAlert className="text-amber-500 w-5 h-5"/> Preconditions</h4>
                            {result.decision.required_preconditions?.length > 0 ? (
                              <ul className="space-y-3 font-semibold text-amber-800">
                                {result.decision.required_preconditions.map((item: string, i: number) => (
                                  <li key={i} className="flex gap-2 isolate before:content-['•'] before:text-amber-500">{item}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-amber-700/60 font-medium">None required.</p>
                            )}
                          </div>

                          <div className="bg-red-50/40 p-8 rounded-[1.5rem] border border-red-200">
                            <h4 className="text-lg font-bold text-red-900 mb-5 flex items-center gap-2"><ShieldAlert className="text-red-500 w-5 h-5"/> Rule Constraints</h4>
                            {result.decision.constraints?.length > 0 ? (
                              <ul className="space-y-3 font-semibold text-red-800">
                                {result.decision.constraints.map((item: string, i: number) => (
                                  <li key={i} className="flex gap-2 isolate before:content-['•'] before:text-red-500">{item}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-red-700/60 font-medium">No constraints triggered.</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-center">
                        <button onClick={handleDownloadPdf} className="px-10 py-5 bg-[#0F4C3A] hover:bg-[#15614b] text-white font-extrabold text-xl rounded-full shadow-2xl shadow-[#0F4C3A]/30 transition-all transform hover:-translate-y-1 flex items-center gap-4">
                          <FileText className="w-6 h-6" />
                          Download Official Compliance PDF
                        </button>
                        <p className="text-sm text-gray-400 font-medium mt-4">Includes full audit trail and assumption logs.</p>
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
