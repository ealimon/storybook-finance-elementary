import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  X,
  Download,
  Info,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';

interface AppStoreGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppStoreGuideModal({ isOpen, onClose }: AppStoreGuideModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border-4 border-lime-200 max-w-3xl w-full p-6 sm:p-8 my-8 relative max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            id="btn-close-app-store-modal"
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="flex items-start gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-lime-500 to-emerald-400 flex items-center justify-center text-white shadow-md shrink-0">
              <Smartphone size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider bg-lime-100 text-lime-800 px-3 py-1 rounded-full">
                  Automated App Store CI/CD Ready
                </span>
                <span className="text-xs font-bold bg-sky-100 text-sky-800 px-2.5 py-1 rounded-full font-mono">
                  ID: com.limon.storybookeducation
                </span>
                <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full font-mono">
                  Team: EYQARSHNW2
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 mt-1.5">
                Apple App Store Preparation Guide
              </h2>
              <p className="text-sm text-slate-600">
                Your application has been configured with native iOS wrappers, safe-area viewport support, and Apple web app manifests.
              </p>
            </div>
          </div>

          {/* What Has Been Prepared in This Codebase */}
          <div className="bg-emerald-50/80 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 mb-6">
            <h3 className="font-display font-bold text-emerald-950 text-base mb-3 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-600" size={20} />
              Configured &amp; Ready in This Repository:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="bg-white p-3 rounded-xl border border-emerald-150 flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <div>
                  <strong className="block text-slate-900">Capacitor iOS Core:</strong>
                  <code>@capacitor/core</code> &amp; <code>@capacitor/ios</code> installed with <code>capacitor.config.ts</code>.
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-150 flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <div>
                  <strong className="block text-slate-900">iOS Notch &amp; Dynamic Island:</strong>
                  <code>viewport-fit=cover</code> &amp; safe area insets <code>env(safe-area-inset-top)</code> configured.
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-150 flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <div>
                  <strong className="block text-slate-900">App Icons &amp; Manifest:</strong>
                  Web App manifest, <code>icon.svg</code>, and Apple mobile web app tags in <code>index.html</code>.
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-150 flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <div>
                  <strong className="block text-slate-900">NPM iOS Scripts:</strong>
                  Helper scripts <code>cap:build</code>, <code>cap:sync</code>, and <code>cap:open:ios</code> in <code>package.json</code>.
                </div>
              </div>
            </div>
          </div>

          {/* GitHub Actions Automated Workflow (Recommended) */}
          <div className="bg-indigo-50/80 border-2 border-indigo-200 rounded-2xl p-4 sm:p-5 mb-6">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <h3 className="font-display font-bold text-indigo-950 text-base flex items-center gap-2">
                <Sparkles className="text-indigo-600" size={20} />
                Automated Cloud CI/CD (GitHub Actions)
              </h3>
              <span className="text-[11px] font-mono bg-indigo-200/70 text-indigo-900 font-bold px-2 py-0.5 rounded">
                .github/workflows/app-store-deploy.yml
              </span>
            </div>
            <p className="text-xs text-indigo-900/90 mb-3 leading-relaxed">
              Every push to <code className="font-bold">main</code> or manual run triggers the workflow on Apple Silicon/macOS, auto-configures the Xcode project, codesigns, and uploads directly to <strong>TestFlight / App Store Connect</strong>!
            </p>
            <div className="bg-white rounded-xl p-3 border border-indigo-200 text-xs">
              <strong className="block text-slate-900 mb-1.5 font-bold">Required GitHub Repository Secrets:</strong>
              <div className="space-y-1 font-mono text-[11px] text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">●</span>
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-900 font-bold">APP_STORE_CONNECT_KEY_P8</code>
                  <span className="text-slate-500 font-sans text-[11px]">— Your App Store Connect API Key (.p8 file contents)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">●</span>
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-900 font-bold">APP_STORE_CONNECT_KEY_ID</code>
                  <span className="text-slate-500 font-sans text-[11px]">— 10-character Key ID (from App Store Connect &gt; Users &amp; Access &gt; Integrations)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">●</span>
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-900 font-bold">APP_STORE_CONNECT_ISSUER_ID</code>
                  <span className="text-slate-500 font-sans text-[11px]">— UUID Issuer ID</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Step Workflow on Mac */}
          <div className="mb-6 space-y-4">
            <h3 className="font-display font-bold text-slate-900 text-lg flex items-center gap-2">
              <Terminal className="text-indigo-600" size={20} />
              Alternative: Manual Local Build on Your Mac
            </h3>

            {/* Step 1 */}
            <div className="border-2 border-slate-200 rounded-2xl p-4 bg-slate-50">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-bold text-xs uppercase text-slate-500">Step 1: Download &amp; Extract Code</span>
                <span className="text-[11px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">AI Studio Menu</span>
              </div>
              <p className="text-xs text-slate-600 mb-2">
                Click the top-right Settings menu in AI Studio and select <strong>"Export to ZIP"</strong> (or connect your GitHub repository). Extract the folder on your Mac.
              </p>
            </div>

            {/* Step 2 */}
            <div className="border-2 border-slate-200 rounded-2xl p-4 bg-slate-50">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-bold text-xs uppercase text-slate-500">Step 2: Generate iOS Project in Terminal</span>
                <button
                  onClick={() => copyToClipboard('npm install\nnpm run build\nnpx cap add ios\nnpx cap open ios', 1)}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 px-2 py-1 rounded cursor-pointer"
                >
                  {copiedIndex === 1 ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  {copiedIndex === 1 ? 'Copied!' : 'Copy Commands'}
                </button>
              </div>
              <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs overflow-x-auto select-all">
                <p># In project directory on your Mac:</p>
                <p>npm install</p>
                <p>npm run build</p>
                <p>npx cap add ios</p>
                <p>npx cap open ios</p>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                This compiles your Vite assets to <code>dist/</code>, generates a native Xcode workspace at <code>ios/App/App.xcworkspace</code>, and opens Xcode automatically.
              </p>
            </div>

            {/* Step 3 */}
            <div className="border-2 border-slate-200 rounded-2xl p-4 bg-slate-50">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-bold text-xs uppercase text-slate-500">Step 3: Test on iPhone Simulator &amp; Archive in Xcode</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                In Xcode:
              </p>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 mt-1">
                <li>Select your connected iPhone or an iOS Simulator (e.g., iPhone 16 Pro) and hit <strong>Run (▶)</strong> to test.</li>
                <li>Under <strong>Signing &amp; Capabilities</strong>, select your Apple Developer Team (<code>EYQARSHNW2</code>).</li>
                <li>Go to <strong>Product &gt; Archive</strong>, then click <strong>Distribute App</strong> to upload to App Store Connect!</li>
              </ul>
            </div>
          </div>

          {/* App Store Guidelines & Checklist for Kids Educational Apps */}
          <div className="bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-4 sm:p-5 mb-6">
            <h3 className="font-display font-bold text-amber-950 text-base mb-2 flex items-center gap-2">
              <ShieldCheck className="text-amber-700" size={20} />
              Apple App Store Review Checklist (Kids Category):
            </h3>
            <ul className="text-xs text-amber-900 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>
                <strong>Apple Developer Account:</strong> An active Apple Developer Program membership ($99/yr) is required to submit to the App Store.
              </li>
              <li>
                <strong>Kids Category / COPPA Compliance:</strong> Since this app targets elementary grades (2–5), declare it in the <em>Kids Category (Ages 6–8 &amp; 9–11)</em>. It contains zero third-party behavioral ads and no personal data collection.
              </li>
              <li>
                <strong>Privacy Policy:</strong> Provide a public URL to your privacy policy in App Store Connect (mandatory for all kids apps).
              </li>
              <li>
                <strong>Screenshots Required:</strong> 6.7" iPhone display (1290 × 2796 px) and 12.9" iPad Pro display (2048 × 2732 px).
              </li>
              <li>
                <strong>1024×1024 App Icon:</strong> Provided without transparency (Apple applies the squircle mask automatically).
              </li>
            </ul>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-200">
            <span className="text-xs text-slate-500 font-medium">
              Bundle ID: <code className="font-mono font-bold text-slate-700">com.limon.storybookeducation</code>
            </span>
            <button
              id="btn-confirm-app-store-modal"
              onClick={onClose}
              className="bg-slate-900 hover:bg-slate-800 text-white font-display font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer w-full sm:w-auto"
            >
              Got It! Close Guide
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
