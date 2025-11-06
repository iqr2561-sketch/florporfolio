
import React from 'react';
import type { Project } from '../types.ts';

interface ProjectCardProps {
  project: Project;
}

const EyeIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
);

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const imageMedia = project.media?.find(m => m.type === 'image');
  const thumbnailUrl = imageMedia ? imageMedia.url : project.thumbnailUrl;

  return (
    <div className="bg-white/70 rounded-2xl shadow-lg overflow-hidden group transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
      <div className="relative">
        <img src={thumbnailUrl} alt={project.title} className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <a href={project.externalUrl} target="_blank" rel="noopener noreferrer" className="bg-[#D08A64] text-white py-2 px-4 rounded-full flex items-center space-x-2 font-semibold transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <EyeIcon />
            <span>Ver más</span>
          </a>
        </div>
      </div>
      <div className="p-6">
        <p className="text-sm font-semibold text-[#C49E85] mb-1">{project.category}</p>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
        <p className="text-gray-600 text-sm mb-4 h-10">{project.description}</p>
        <div className="flex flex-wrap gap-2">
            {project.tools.map(tool => (
                <span key={tool} className="text-xs bg-[#F2E4D8] text-gray-700 px-2 py-1 rounded-md">{tool}</span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;