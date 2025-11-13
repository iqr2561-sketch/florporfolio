import React, { useState } from 'react';
import type { Section } from '../types.ts';

const MenuIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
);

const XIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);


interface SidebarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

const navItems: { section: Section; label: string }[] = [
    { section: 'sobre-mi', label: 'Sobre mí' },
    { section: 'mis-trabajos', label: 'Mis trabajos' },
    { section: 'contacto', label: 'Contacto' },
    { section: 'panel', label: 'Panel' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavClick = (section: Section) => {
        setActiveSection(section);
        setIsMenuOpen(false); // Close menu on navigation
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-[#F5C7A9]/80 backdrop-blur-sm shadow-lg z-50 transition-all duration-300">
            <div className="mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between h-20">
                {/* Logo / Home Button */}
                <button 
                    onClick={() => handleNavClick('inicio')} 
                    className="flex-shrink-0 group flex items-center space-x-4"
                    aria-label="Ir a la página de inicio"
                >
                     <div className="w-12 h-12 bg-[#D08A64] rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <span className="text-white font-bold text-xl">FC</span>
                    </div>
                    <div className="hidden sm:flex items-baseline space-x-2">
                        <span className="text-xl font-bold text-gray-800 group-hover:text-[#D08A64] transition-colors">Florencia Cosmedi</span>
                    </div>
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-2">
                    {navItems.map((item) => {
                        const isActive = activeSection === item.section;
                        return (
                            <button 
                                key={item.section}
                                onClick={() => handleNavClick(item.section)}
                                className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${isActive ? 'text-[#D08A64]' : 'text-gray-600 hover:text-black'}`}
                            >
                                {item.label}
                                {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-[#D08A64] rounded-full"></span>}
                            </button>
                        );
                    })}
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-[#D08A64] focus:outline-none p-2" aria-label="Abrir menú">
                        {isMenuOpen ? <XIcon className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
                <nav className={`bg-[#F5C7A9]/95 backdrop-blur-sm px-2 pt-2 pb-4 space-y-1 border-t border-[#EAD7C4]`}>
                     {/* Adding Home to mobile menu */}
                     <button
                        onClick={() => handleNavClick('inicio')}
                        className={`block w-full text-left px-4 py-3 rounded-md text-base font-medium transition-colors duration-300 ${activeSection === 'inicio' ? 'bg-[#D08A64] text-white' : 'text-gray-700 hover:bg-[#EAD7C4]'}`}
                    >
                        Inicio
                    </button>
                    {navItems.map((item) => {
                        const isActive = activeSection === item.section;
                        return (
                            <button
                                key={item.section}
                                onClick={() => handleNavClick(item.section)}
                                className={`block w-full text-left px-4 py-3 rounded-md text-base font-medium transition-colors duration-300 ${isActive ? 'bg-[#D08A64] text-white' : 'text-gray-700 hover:bg-[#EAD7C4]'}`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
};

export default Sidebar;