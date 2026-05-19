// src/App.tsx
import React, { useState } from 'react';
import { 
  type PaymentMethod, 
  type PaymentPayload, 
  type GatewayResponse, 
  type CourseLevel, 
  type PricingTier 
} from './types';
import { 
  initiateDarajaStkPush, 
  processUnifiedGatewayPayment 
} from './utils/payment';

export default function App() {
  // Navigation & UI State
  const [selectedLevel, setSelectedLevel] = useState<string>('l1');
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  
  // Checkout State
  const [selectedPlan, setSelectedPlan] = useState<PricingTier | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [studentName, setStudentName] = useState<string>('');
  const [parentEmail, setParentEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  
  // Transaction State
  const [processing, setProcessing] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('');

  // Curriculum Data
  const levels: CourseLevel[] = [
    {
      id: 'l1',
      title: 'Level 1: The Digital Creators',
      age: 'Ages 8–10 (Beginners)',
      description: 'Master logical sequences, structural block-based programming, and foundational digital design patterns.',
      tools: ['Scratch 3.0', 'Tinkercad 3D', 'micro:bit Simulator'],
      skills: ['Algorithmic Thinking', 'Spatial Literacy', 'CBC Digital Competence']
    },
    {
      id: 'l2',
      title: 'Level 2: The Problem Solvers',
      age: 'Ages 11–13 (Intermediate)',
      description: 'Bridge the gap between visual logic blocks and real text-based application syntax, web structures, and AI models.',
      tools: ['Python Core', 'HTML5 & CSS3 Layouts', 'Teachable Machine'],
      skills: ['Syntax Architecture', 'UI/UX Wireframing', 'Data Analytics Literacy']
    },
    {
      id: 'l3',
      title: 'Level 3: Future Tech Pioneers',
      age: 'Ages 14–15+ (Advanced)',
      description: 'Build enterprise-grade software architecture, query dynamic third-party APIs, and model scalable tech startups.',
      tools: ['Advanced Python OOP', 'JavaScript', 'Firebase Full-Stack', 'OpenAI API'],
      skills: ['Object-Oriented Coding', 'Full-Stack Engineering', 'SaaS Business Scalability']
    }
  ];

  // Pricing Data
  const plans: PricingTier[] = [
    {
      id: 'pod-classes',
      name: 'After-School & Weekend Pods',
      price: 12000,
      displayPrice: 'KES 12,000',
      billing: 'per child / term',
      features: [
        '2 weekly practical class cohorts',
        'Access to our specialized learning cloud',
        'Full hardware simulator licenses',
        'Termly Demo Day entrance ticket'
      ],
      popular: true
    },
    {
      id: 'premium-tier',
      name: 'Elite Private 1-on-1 Tutoring',
      price: 45000,
      displayPrice: 'KES 45,000',
      billing: 'per child / term',
      features: [
        'Dedicated Senior Tech Mentor',
        'Customized delivery speed matching',
        'Direct project repository oversight',
        'Comprehensive technical career mapping'
      ],
      popular: false
    }
  ];

  // Handle Payment Modal Trigger
  const openCheckout = (plan: PricingTier) => {
    setSelectedPlan(plan);
    setPaymentModalOpen(true);
    setPaymentSuccess(false);
    setStatusMsg('');
  };

  // Handle Form Submission & API Routing
  const executePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setProcessing(true);
    setStatusMsg('Connecting to secure gateway channels...');
    
    let response: GatewayResponse;

    try {
      if (paymentMethod === 'mpesa') {
        response = await initiateDarajaStkPush(selectedPlan.price, phoneNumber, selectedPlan.id);
      } else {
        const payload: PaymentPayload = {
          amount: selectedPlan.price,
          email: parentEmail,
          studentName: studentName,
          planId: selectedPlan.id,
          method: paymentMethod,
          phoneNumber: phoneNumber
        };
        response = await processUnifiedGatewayPayment(payload);
      }

      setStatusMsg(response.message);
      
      if (response.success) {
        setTimeout(() => setPaymentSuccess(true), 1500); 
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setStatusMsg('An error occurred during transaction routing.');

    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-blue-200 scroll-smooth">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Dumu<span className="text-blue-600">Labs</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan-500 block">FOR KIDS</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#about" className="hover:text-blue-600 transition">About</a>
            <a href="#curriculum" className="hover:text-blue-600 transition">Curriculum</a>
            <a href="#partnerships" className="hover:text-blue-600 transition">For Schools</a>
            <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
          </nav>
          <div>
            <a 
              href="#pricing" 
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition"
            >
              Enroll Academy
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="about" className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full text-xs font-semibold text-blue-700 uppercase tracking-wider">
              <span>🚀 CBC-Aligned & Internationally Competitive</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Don’t Just Let Them Play Games. Train Them To <span className="text-blue-600">Code The Future</span>.
            </h1>
            <p className="text-lg text-slate-600 max-w-xl">
              Premium Coding, Web Development, and Applied Artificial Intelligence tracks for young minds aged 8 to 15+ in Kenya. Turning passive consumption into software mastery.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#pricing" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-md transition transform active:scale-95"
              >
                Secure Academy Spot
              </a>
              <a 
                href="#curriculum" 
                className="bg-white border border-slate-200 text-slate-700 font-semibold px-8 py-4 rounded-xl hover:bg-slate-50 transition"
              >
                Explore Syllabus Matrix
              </a>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="w-full h-80 lg:h-96 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-3xl shadow-xl flex items-center justify-center p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-slate-900 opacity-10"></div>
              <div className="relative space-y-4 text-center z-10">
                <div className="text-6xl font-black">80 / 20</div>
                <div className="text-sm uppercase tracking-widest font-bold text-cyan-200">Project-Based Learning Ratio</div>
                <p className="text-sm text-blue-50/90 max-w-xs mx-auto mt-4">
                  Students spend 80% of every class hour writing operational code, debugging servers, and deploying assets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CURRICULUM SECTION */}
      <section id="curriculum" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Engineered Age Pathways
          </h2>
          <p className="text-slate-600">
            A comprehensive, multi-year progression framework mapped across three tiered age milestones.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {levels.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevel(lvl.id)}
              className={`px-6 py-3.5 rounded-xl font-semibold text-sm transition ${
                selectedLevel === lvl.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {lvl.title.split(':')[0]}
            </button>
          ))}
        </div>

        <div className="bg-white border border-slate-100 shadow-xl rounded-3xl p-8 lg:p-12 max-w-4xl mx-auto transition-all duration-300">
          {levels.filter(l => l.id === selectedLevel).map((lvl) => (
            <div key={lvl.id} className="grid md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-7 space-y-4">
                <span className="text-xs font-bold text-cyan-600 tracking-wider uppercase bg-cyan-50 px-2.5 py-1 rounded-md">{lvl.age}</span>
                <h3 className="text-2xl font-bold text-slate-900">{lvl.title}</h3>
                <p className="text-slate-600 text-base leading-relaxed">{lvl.description}</p>
                
                <div className="pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Core Target Competencies Built</h4>
                  <div className="flex flex-wrap gap-2">
                    {lvl.skills.map((s, i) => (
                      <span key={i} className="text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100 px-3 py-1 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 bg-blue-50/50 rounded-2xl p-6 border border-blue-50">
                <h4 className="text-sm font-bold text-blue-900 mb-4 tracking-wide uppercase">Core Sandbox Toolstack</h4>
                <ul className="space-y-2">
                  {lvl.tools.map((t, i) => (
                    <li key={i} className="flex items-center space-x-3 text-sm font-medium text-slate-700">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PARTNERSHIPS SECTION */}
      <section id="partnerships" className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">INSTITUTIONAL PLUG & PLAY</span>
            <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight">
              Transform Your Institutional Computer Lab Into An Innovation Center.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              We partner with forward-thinking schools to run managed coding club frameworks. We process background vetting, pedagogical operations, hardware setups, and direct customer care support.
            </p>
          </div>
          <div className="lg:col-span-6 bg-slate-800 border border-slate-700/60 rounded-3xl p-8 space-y-6">
            <h3 className="text-xl font-bold">Request Institutional Strategy Call</h3>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="School Official Name" className="w-full bg-slate-900 text-sm border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-blue-500 transition text-white" required />
              <input type="email" placeholder="Official Institutional Email" className="w-full bg-slate-900 text-sm border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-blue-500 transition text-white" required />
              <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm p-3.5 rounded-xl shadow-md transition">
                Submit Strategy Request
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Investment Ecosystem Plans
          </h2>
          <p className="text-slate-600">
            Premium developmental tracks built with scale and long-term tech portfolio results in mind.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-white rounded-3xl border p-8 flex flex-col justify-between relative transition hover:shadow-lg ${
                plan.popular ? 'border-blue-600 ring-1 ring-blue-600' : 'border-slate-100'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 right-8 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Most Demanded Plan
                </span>
              )}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold tracking-tight text-slate-900">{plan.displayPrice}</span>
                    <span className="ml-1 text-sm text-slate-500">{plan.billing}</span>
                  </div>
                </div>
                <ul className="space-y-3 border-t border-slate-50 pt-6">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-sm text-slate-600">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-8">
                <button
                  onClick={() => openCheckout(plan)}
                  className={`w-full font-semibold text-sm py-3.5 rounded-xl transition ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Authorize Enrollment Fee
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-50 border-t border-slate-100 py-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          <p className="font-semibold text-slate-600 text-sm">DumuLabs for Kids Academy Kenya</p>
          <p>Full Professional Curriculum Framework aligned safely with internal Kenya Ministry of Education CBC and IGCSE ICT targets.</p>
          <p className="pt-4 border-t border-slate-200/60 max-w-md mx-auto">
            &copy; {new Date().getFullYear()} DumuLabs Ltd. All parameters reserved.
          </p>
        </div>
      </footer>

      {/* DETACHED ENROLLMENT / CHECKOUT MODAL */}
      {paymentModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 transform transition-all relative max-h-[90vh] overflow-y-auto">
            
            <div className="bg-blue-600 p-6 text-white sticky top-0 z-10">
              <button 
                onClick={() => setPaymentModalOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition text-lg font-bold"
              >
                ✕
              </button>
              <span className="text-[10px] font-bold tracking-widest uppercase bg-blue-500/50 px-2 py-0.5 rounded text-blue-100">Gateway Secure Checkout</span>
              <h3 className="text-xl font-bold mt-1">Complete Student Enrollment</h3>
              <p className="text-xs text-blue-100/90 mt-1">Target: <span className="font-semibold text-white">{selectedPlan.name}</span></p>
            </div>

            <div className="p-6">
              {!paymentSuccess ? (
                <form onSubmit={executePaymentSubmit} className="space-y-5">
                  
                  {/* Basic Info */}
                  <div className="space-y-3">
                    <input type="text" required placeholder="Student Full Name" value={studentName} onChange={e => setStudentName(e.target.value)} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 transition" />
                    <input type="email" required placeholder="Parent Email Address" value={parentEmail} onChange={e => setParentEmail(e.target.value)} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 transition" />
                  </div>

                  {/* Payment Channel Toggles */}
                  <div className="grid grid-cols-2 gap-1 p-1 bg-slate-50 border rounded-xl text-xs font-semibold text-slate-500">
                    <button type="button" onClick={() => setPaymentMethod('mpesa')} className={`py-2 rounded-lg transition ${paymentMethod === 'mpesa' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'hover:text-slate-800'}`}>
                      Native Daraja (M-Pesa)
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('opensource_gateway')} className={`py-2 rounded-lg transition ${paymentMethod === 'opensource_gateway' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'hover:text-slate-800'}`}>
                      Unified Global Router
                    </button>
                  </div>

                  {/* Dynamic Payment Fields based on toggle */}
                  {paymentMethod === 'mpesa' ? (
                    <div className="space-y-1.5 bg-blue-50/50 p-4 rounded-xl border border-blue-50">
                      <label className="text-xs font-bold text-blue-900 block">Safaricom Mobile Number</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="e.g., 0712345678" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full border border-blue-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 transition text-slate-800 bg-white"
                      />
                      <span className="text-[10px] text-slate-500 block">An instant STK push prompt will be directed to this device for {selectedPlan.displayPrice}.</span>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 text-center">
                      <p className="text-xs text-slate-500 mb-2">Routing transaction securely via unified multi-channel provider (Cards, Bank Transfer, Apple/Google Pay).</p>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PCI-DSS Compliant</span>
                    </div>
                  )}

                  {/* Status & Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm py-3.5 rounded-xl transition shadow-md"
                    >
                      {processing ? 'Processing Secure Verification...' : `Authorize ${selectedPlan.displayPrice}`}
                    </button>
                  </div>

                  {statusMsg && (
                    <p className={`text-xs text-center font-medium p-2.5 rounded-xl border ${processing ? 'text-blue-600 bg-blue-50 border-blue-100' : 'text-slate-600 bg-slate-50 border-slate-200'}`}>
                      {statusMsg}
                    </p>
                  )}
                </form>
              ) : (
                <div className="text-center py-10 space-y-4 animate-fade-in">
                  <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 text-3xl font-bold">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-slate-900">Payment Authorization Successful</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                      Your payment for the <span className="font-bold text-slate-700">{selectedPlan.name}</span> has been processed. An admissions counselor will reach out to <span className="font-bold text-slate-700">{parentEmail}</span> shortly to complete student allocation.
                    </p>
                  </div>
                  <button
                    onClick={() => setPaymentModalOpen(false)}
                    className="mt-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm px-8 py-3 rounded-xl transition"
                  >
                    Return to Portal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}