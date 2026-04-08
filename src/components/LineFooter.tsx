export default function LineFooter() {
  return (
    <footer className="w-full bg-white font-inter my-8">
      <div className="container-custom py-10 flex flex-col md:flex-row items-center justify-between text-[11px] md:text-[12px] text-[#2c2c2c] font-medium tracking-wide">
        <div className="flex items-center gap-1">
            © {new Date().getFullYear()} Hazem Anwar. <span className="hidden md:inline">All rights reserved.</span>
          </div>
        <div className="mt-4 md:mt-0 flex items-center gap-6 uppercase tracking-widest text-[10px] md:text-[11px] font-bold">
            <a href="https://www.linkedin.com/in/hazem-anwar98/" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff4d00] transition-colors">LinkedIn</a>
            <a href="https://www.behance.net/hazem-anwar" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff4d00] transition-colors">Behance</a>
            <a href="mailto:hazem.amrainana98@gmail.com" className="hover:text-[#ff4d00] transition-colors">Email</a>
          </div>
        </div>
    </footer>
  );
}
