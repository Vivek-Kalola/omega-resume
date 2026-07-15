import { Link } from 'react-router-dom';
import { FileText, Briefcase, Zap } from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#0a0a0a] text-white">
      <div className="max-w-4xl w-full text-center space-y-4 mb-16">
        <h1 className="text-5xl font-bold tracking-tight">
          Observability for <span className="text-[rgb(250,204,21)]">Humans</span>.<br />
          Automated Rescue.
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Explore the suite of tools by Omega Intelligence. Premium engineering utilities designed with a relentless focus on the user experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Active Product: Resume Builder */}
        <Link 
          to="/builder" 
          className="group relative flex flex-col bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-[rgb(250,204,21)] transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(250,204,21,0.15)]"
        >
          <div className="flex items-center space-x-3 mb-4 text-[rgb(250,204,21)]">
            <FileText size={24} />
            <h2 className="text-xl font-semibold text-white">Resume Builder</h2>
          </div>
          <p className="text-gray-400 text-sm flex-grow">
            Craft a professional, high-performance resume with our interactive A4 editor. Immediate results.
          </p>
          <div className="mt-6 flex items-center text-sm font-medium text-[rgb(250,204,21)] group-hover:translate-x-1 transition-transform">
            Open App &rarr;
          </div>
        </Link>

        {/* Dummy Product 1 */}
        <div className="relative flex flex-col bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 opacity-70 cursor-not-allowed">
          <div className="absolute top-4 right-4 text-[10px] uppercase tracking-wide text-zinc-500 font-bold px-2 py-1 bg-zinc-800 rounded-md">Coming Soon</div>
          <div className="flex items-center space-x-3 mb-4 text-zinc-400">
            <Zap size={24} />
            <h2 className="text-xl font-semibold text-white">Live Engine</h2>
          </div>
          <p className="text-zinc-500 text-sm">
            Real-time telemetry engine for distributed systems and agentic workflows.
          </p>
        </div>

        {/* Dummy Product 2 */}
        <div className="relative flex flex-col bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 opacity-70 cursor-not-allowed">
          <div className="absolute top-4 right-4 text-[10px] uppercase tracking-wide text-zinc-500 font-bold px-2 py-1 bg-zinc-800 rounded-md">Coming Soon</div>
          <div className="flex items-center space-x-3 mb-4 text-zinc-400">
            <Briefcase size={24} />
            <h2 className="text-xl font-semibold text-white">Shield Levels</h2>
          </div>
          <p className="text-zinc-500 text-sm">
            Automated orchestration and threat modeling primitive. Remove human relay.
          </p>
        </div>
      </div>
    </div>
  );
};
