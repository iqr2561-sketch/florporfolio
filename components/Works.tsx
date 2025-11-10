
import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard.tsx';
import type { Project, MarketingItem } from '../types.ts';
import { getMarketingItems } from '../lib/marketingService.ts';

interface WorksProps {
    projects: Project[];
}


const MarketingCard: React.FC<{ item: MarketingItem }> = ({ item }) => {
    return (
        <div className="bg-white/70 rounded-2xl shadow-lg overflow-hidden group transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
            <div className="relative aspect-square w-full">
                <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
            </div>
        </div>
    );
};

const Works: React.FC<WorksProps> = ({ projects }) => {
    const [filter, setFilter] = useState('Todos');
    const [marketingItems, setMarketingItems] = useState<MarketingItem[]>([]);
    const [loadingMarketing, setLoadingMarketing] = useState(true);
    
    useEffect(() => {
        const loadMarketingItems = async () => {
            try {
                setLoadingMarketing(true);
                const items = await getMarketingItems();
                setMarketingItems(items);
            } catch (error) {
                console.error('Error loading marketing items:', error);
            } finally {
                setLoadingMarketing(false);
            }
        };
        loadMarketingItems();
    }, []);
    
    const categories = ['Todos', ...Array.from(new Set(projects.map(p => p.category)))];
    
    const filteredProjects = filter === 'Todos' 
        ? projects 
        : projects.filter(p => p.category === filter);

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

            {/* Sección de Marketing */}
            {marketingItems.length > 0 && (
                <div className="mt-20">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">Marketing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {marketingItems.map(item => (
                            <MarketingCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Works;