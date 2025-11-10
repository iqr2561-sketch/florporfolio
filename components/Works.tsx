
import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard.tsx';
import type { Project, MarketingItem } from '../types.ts';
import { getMarketingItems } from '../lib/marketingService.ts';

interface WorksProps {
    projects: Project[];
}

const ChevronLeftIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const MarketingCard: React.FC<{ item: MarketingItem }> = ({ item }) => {
    return (
        <div className="bg-white/70 rounded-2xl shadow-lg overflow-hidden group transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
            <div className="relative">
                <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110" 
                />
            </div>
            <div className="p-6">
                <p className="text-sm font-semibold text-[#C49E85] mb-1">Marketing</p>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
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
    if (marketingItems.length > 0 && !categories.includes('Marketing')) {
        categories.push('Marketing');
    }
    
    const filteredProjects = filter === 'Todos' 
        ? projects 
        : filter === 'Marketing'
        ? []
        : projects.filter(p => p.category === filter);
    
    const showMarketing = filter === 'Todos' || filter === 'Marketing';

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
                {showMarketing && marketingItems.map(item => (
                    <MarketingCard key={item.id} item={item} />
                ))}
            </div>

            {/* Slider de Marketing en la parte inferior */}
            {marketingItems.length > 0 && (
                <div className="mt-16">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">Marketing</h3>
                    <MarketingSlider items={marketingItems} />
                </div>
            )}
        </section>
    );
};

const MarketingSlider: React.FC<{ items: MarketingItem[] }> = ({ items }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextItem = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    const prevItem = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    const goToItem = (index: number) => {
        setCurrentIndex(index);
    };

    const currentItem = items[currentIndex];
    const hasMultipleItems = items.length > 1;

    return (
        <div className="max-w-5xl mx-auto">
            <div className="relative bg-white/70 rounded-2xl shadow-lg overflow-hidden group">
                {/* Imagen principal */}
                <div className="relative aspect-video w-full">
                    <img 
                        src={currentItem.image_url} 
                        alt={currentItem.title}
                        className="w-full h-full object-cover transition-opacity duration-500"
                        key={currentIndex}
                    />
                    
                    {/* Botones de navegación */}
                    {hasMultipleItems && (
                        <>
                            <button
                                onClick={prevItem}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                                aria-label="Elemento anterior"
                            >
                                <ChevronLeftIcon className="w-6 h-6" />
                            </button>
                            
                            <button
                                onClick={nextItem}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                                aria-label="Elemento siguiente"
                            >
                                <ChevronRightIcon className="w-6 h-6" />
                            </button>
                        </>
                    )}
                    
                    {/* Contador */}
                    {hasMultipleItems && (
                        <div className="absolute top-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                            {currentIndex + 1} / {items.length}
                        </div>
                    )}
                </div>
                
                {/* Información del elemento */}
                <div className="p-6 md:p-8">
                    <h4 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">{currentItem.title}</h4>
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed">{currentItem.description}</p>
                </div>
                
                {/* Indicadores de puntos */}
                {hasMultipleItems && (
                    <div className="flex justify-center gap-2 pb-6">
                        {items.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToItem(index)}
                                className={`h-3 rounded-full transition-all duration-300 ${
                                    index === currentIndex 
                                        ? 'bg-[#D08A64] w-8' 
                                        : 'bg-gray-300 hover:bg-gray-400 w-3'
                                }`}
                                aria-label={`Ir a elemento ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Works;