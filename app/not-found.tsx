import Link from "next/link";
import localFont from "next/font/local";

const myfont = localFont({
  src: "../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl max-w-2xl mx-auto">
          <h1 className={`${myfont.className} text-6xl md:text-8xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4`}>
            404
          </h1>
          <h2 className="text-3xl md:text-4xl text-white font-semibold mb-6">
            Page Not Found
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Link
            className="inline-block bg-gradient-to-r from-purple-800/80 via-slate-700/80 to-purple-800/80 hover:from-purple-700/90 hover:via-slate-600/90 hover:to-purple-700/90 border-2 border-purple-500/50 hover:border-purple-400/70 text-purple-100 font-mono text-sm tracking-widest py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg shadow-md uppercase backdrop-blur-sm"
            href="/"
          >
            → RETURN HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
