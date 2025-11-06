
import React, { useState } from 'react';
import ProjectCard from './ProjectCard.tsx';
import type { Project } from '../types.ts';


interface WorksProps {
    projects: Project[];
}

const Works: React.FC<WorksProps> = ({ projects }) => {
    const [filter, setFilter] = useState('Todos');
    
    const categories = ['Todos', ...Array.from(new Set(projects.map(p => p.category)))];
    
    const filteredProjects = filter === 'Todos' ? projects : projects.filter(p => p.category === filter);

    return (
        <section id="mis-trabajos" className="min-h-screen animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">Mis Trabajos</h2>
            
            <div className="flex justify-center flex-wrap gap-2 mb-10">
                {categories.map(category => (
                    <button 
                        key={category}
                        onClick={() => setFilter(category)}
                        className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 shadow-sm ${filter === category ? 'bg-[#D08A64] text-white' : 'bg-white/60 text-gray-700 hover:bg-[#EAD7C4]'}`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </section>
    );
};

export default Works;