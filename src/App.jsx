import React, { useState, useEffect, useRef } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';
import Experience from './components/Experience';
import LoadBalancer from './components/LoadBalancer';
import Projects from './components/Projects';
import Education from './components/Education';
import Contact from './components/Contact';
import portfolioData from './data/data.json';
import Skills from './components/Skills';
import ReactGA from 'react-ga4';
import { FileText, Terminal, Play, Loader, Server, CheckCircle2 } from 'lucide-react';

function App() {
  const [activeRoute, setActiveRoute] = useState(null);
  const [isBooting, setIsBooting] = useState(true);
  const [isRouting, setIsRouting] = useState(false);
  const [visitedRoutes, setVisitedRoutes] = useState(new Set());
  
  // NEW: State to hold the exact cache string to display permanently
  const [cacheMessage, setCacheMessage] = useState(""); 
  
  const loadBalancerRef = useRef(null);
  useEffect(() => {
    ReactGA.initialize("G-SPCST0SYRE");
    // Send a pageview event for the initial load
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  const handleRouteRequest = (routeId) => {
    if (activeRoute === routeId) return;

    setIsRouting(true);
    setActiveRoute(routeId);

    ReactGA.event({
      category: "Load Balancer",
      action: "Module Routed",
      label: routeId // This will log 'experience', 'projects', etc.
    });

    setTimeout(() => {
      if (loadBalancerRef.current) {
        const yOffset = -20; 
        const element = loadBalancerRef.current;
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);

    const isCacheHit = visitedRoutes.has(routeId);
    
    // Set the message dynamically so we can persist it later
    setCacheMessage(
      isCacheHit 
        ? `> ${portfolioData.infrastructure_copy.cache_hit}` 
        : `> ${portfolioData.infrastructure_copy.cache_miss}`
    );

    const simulatedDelay = isCacheHit ? 700 : 900;

    setTimeout(() => {
      setIsRouting(false);
      setVisitedRoutes((prev) => new Set(prev).add(routeId));
    }, simulatedDelay);
  };

  return (
    <div className="min-h-screen bg-ivory font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        
        {/* --- THE BOOT SEQUENCE --- */}
        {isBooting ? (
          <motion.div
            key="boot-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="h-screen w-full flex flex-col items-center justify-center bg-ivory p-4"
          >
            {/* INCREASED: max-w-md to max-w-2xl, p-6 to p-10 */}
            <div className="max-w-2xl w-full p-10 bg-white border-2 border-sand rounded-lg shadow-xl">
              <div className="flex items-center gap-2 mb-6 border-b border-sand pb-4">
                <Terminal className="w-6 h-6 text-leaf" />
                <span className="font-mono text-base text-leaf font-bold">SYSTEM BOOT</span>
              </div>
              
              {/* INCREASED: text-sm to text-base */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-mono text-base text-gray-600 space-y-4"
              >
                <p> {portfolioData.infrastructure_copy.dns_resolution.split('...')[0]}...</p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                   Resolving to IP: {portfolioData.site_metadata.ip_mock}...
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="text-leaf font-bold">
                   Handshake successful. Awaiting user prompt...
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5 }}
                  className="pt-8 mt-6 border-t border-sand border-dashed"
                >
                  <button
                    onClick={() => setIsBooting(false)}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-leaf text-ivory font-mono font-bold text-lg rounded hover:bg-leaf-light transition-colors shadow-sm"
                  >
                    <Play className="w-5 h-5 fill-current" /> [ ENTER_SYSTEM ]
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          
          /* --- THE MAIN APPLICATION --- */
          <motion.div
            key="main-app"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* REDUCED: Removed top margin (mt-8) to close the gap */}
            <header className="p-8 border-b border-sand text-center relative max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-leaf overflow-hidden shadow-lg flex-shrink-0"
              >
                <img 
                  src="/profile.jpg" 
                  alt={portfolioData.site_metadata.name} 
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <div className="text-center md:text-left">
                <h1 className="text-5xl font-bold text-leaf tracking-tight">
                  {portfolioData.hero.headline}
                </h1>
                <p className="text-xl text-leaf-light mt-4 font-medium mb-6 max-w-lg">
                  {portfolioData.hero.sub_headline}
                </p>
                <a 
                  href="/resume.pdf" 
                  download="Mokshith_Sai_Gadela_Resume.pdf"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-sand text-leaf-light font-semibold rounded-full hover:bg-leaf hover:text-ivory transition-colors duration-300 text-sm"
                >
                  <FileText className="w-4 h-4" /> Download Standard Resume
                </a>
              </div>
            </header>

            {/* REDUCED: py-6 to py-2 to pull content up */}
            <main className="max-w-5xl mx-auto py-2 px-4">
              
              <div ref={loadBalancerRef} className="scroll-mt-4">
                <LoadBalancer setActiveRoute={handleRouteRequest} activeRoute={activeRoute} />
              </div>

              {/* REDUCED: mt-4 to mt-0 */}
              <div className="mt-0 min-h-[400px]">
                <AnimatePresence mode="wait">
                  
                  {/* STATE 1: IDLE / NO ROUTE SELECTED */}
                  {!activeRoute && !isRouting && (
                    <motion.div
                      key="idle-state"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-16 text-leaf-light/60"
                    >
                      <div className="relative mb-10">
                        {/* INCREASED: Server size from w-32 to w-48 */}
                        <Server className="w-48 h-48" strokeWidth={1} />
                        <span className="absolute top-8 right-8 flex h-8 w-8">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-leaf opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-8 w-8 bg-leaf"></span>
                        </span>
                      </div>
                      <p className="font-mono text-sm bg-sand/50 px-4 py-2 rounded-full">
                        [ STATUS: IDLE. AWAITING INGRESS TRAFFIC ]
                      </p>
                    </motion.div>
                  )}

                  {/* STATE 2: LOADING / QUERYING */}
                  {isRouting && (
                    <motion.div
                      key="loading-state"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col items-center justify-center py-24 text-leaf-light font-mono"
                    >
                      <Loader className="w-10 h-10 animate-spin mb-6 text-leaf" />
                      <p className="text-sm bg-sand px-4 py-2 rounded-full shadow-sm">
                        {cacheMessage}
                      </p>
                    </motion.div>
                  )}
                  
                  {/* STATE 3: CONTENT RENDER */}
                  {!isRouting && activeRoute && (
                    <motion.div
                      key={activeRoute}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center w-full"
                    >
                      {/* NEW: Persisted Cache Tag sits right above the components */}
                      <div className="mb-6 flex items-center justify-center gap-2 font-mono text-xs text-leaf-light bg-sand/40 px-4 py-1.5 rounded-full border border-sand">
                        <CheckCircle2 className="w-3 h-3 text-leaf" />
                        {cacheMessage.replace('> ', '')} 
                      </div>

                      <div className="w-full">
                        {activeRoute === 'experience' && <Experience />}
                        {activeRoute === 'skills' && <Skills />}
                        {activeRoute === 'projects' && <Projects />}
                        {activeRoute === 'education' && <Education />}
                        {activeRoute === 'contact' && <Contact />}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </main>

            <div className="h-[60vh] flex flex-col items-center justify-end pb-12 opacity-40 hover:opacity-100 transition-opacity duration-500">
              <div className="font-mono text-xs text-leaf-light text-center space-y-2">
                <p>... Background processes running ...</p>
                <p> Rebalancing Kafka partitions</p>
                <p> Resolving split-brain scenarios</p>
                <p> Waiting for Paxos consensus</p>
                <p className="animate-pulse"> Trying to exit vim...</p>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;