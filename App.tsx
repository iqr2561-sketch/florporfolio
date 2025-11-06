import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Home from './components/Home.tsx';
import About from './components/About.tsx';
import Works from './components/Works.tsx';
import Contact from './components/Contact.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import InteractiveBackground from './components/InteractiveBackground.tsx';
import type { Section, Project } from './types.ts';
import { PROJECTS } from './constants.ts';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('inicio');
  const [isAnimating, setIsAnimating] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    try {
        const storedProjects = localStorage.getItem('portfolioProjects');
        if (storedProjects) {
            setProjects(JSON.parse(storedProjects));
        } else {
            const initialProjects = PROJECTS.map(p => ({ ...p, media: [] }));
            setProjects(initialProjects);
        }
    } catch (error) {
        console.error("Failed to load projects from localStorage", error);
        const initialProjects = PROJECTS.map(p => ({ ...p, media: [] }));
        setProjects(initialProjects);
    }
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
        try {
            localStorage.setItem('portfolioProjects', JSON.stringify(projects));
        } catch (error) {
            console.error("Failed to save projects to localStorage", error);
        }
    }
  }, [projects]);


  const handleSectionChange = (section: Section) => {
    if (section !== activeSection) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveSection(section);
        window.scrollTo(0, 0); // Reset scroll on page change for better UX
        setIsAnimating(false);
      }, 300); // Match transition duration
    }
  };
  
  const renderSection = () => {
    switch (activeSection) {
      case 'inicio':
        return <Home onNavigate={handleSectionChange} projects={projects} />;
      case 'sobre-mi':
        return <About />;
      case 'mis-trabajos':
        return <Works projects={projects} />;
      case 'contacto':
        return <Contact />;
      case 'panel':
        return <AdminPanel projects={projects} setProjects={setProjects} />;
      default:
        return <Home onNavigate={handleSectionChange} projects={projects} />;
    }
  };

  return (
    <div className="relative z-0 flex flex-col min-h-screen">
      <InteractiveBackground />
      <Sidebar activeSection={activeSection} setActiveSection={handleSectionChange} />
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12 overflow-y-auto custom-scrollbar transition-opacity duration-300 ease-in-out pt-28 md:pt-32" style={{ opacity: isAnimating ? 0 : 1 }}>
        <div>
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default App;