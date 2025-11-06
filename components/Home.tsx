import React from 'react';
import ProjectCard from './ProjectCard.tsx';
import type { Section, Project } from '../types.ts';

interface HomeProps {
    onNavigate: (section: Section) => void;
    projects: Project[];
}

const Home: React.FC<HomeProps> = ({ onNavigate, projects }) => {
    const featuredProjects = projects.slice(0, 3);

    return (
        <section id="inicio" className="min-h-screen animate-fade-in">
            <div className="text-center mb-16 pt-8 md:pt-12">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#D08A64] mb-4 leading-tight">Florencia Cosmedi</h1>
                <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
                    Técnica en Diseño, Imagen y Sonido. Creando experiencias visuales y audiovisuales que conectan, emocionan y comunican con propósito.
                </p>
            </div>

            <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Proyectos Destacados</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredProjects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>

            <div className="text-center">
                <button 
                    onClick={() => onNavigate('mis-trabajos')}
                    className="bg-[#D08A64] text-white font-semibold py-3 px-8 rounded-full hover:bg-[#C49E85] transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Ver todos mis trabajos
                </button>
            </div>
        </section>
    );
};

export default Home;