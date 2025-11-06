import React, { useState, useEffect } from 'react';
import { SKILLS, TIMELINE_EVENTS } from '../constants.ts';
import type { TimelineEvent } from '../types.ts';
import { getProfileImage } from '../lib/projectsService.ts';

const BookOpenIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
);
const BriefcaseIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);
const SparklesIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 16l-4 4 4-4 5.293-5.293a1 1 0 011.414 0L21 11.707" /></svg>
);

const getIconForType = (type: TimelineEvent['type']) => {
    switch (type) {
        case 'education': return <BookOpenIcon className="w-6 h-6 text-white" />;
        case 'experience': return <BriefcaseIcon className="w-6 h-6 text-white" />;
        case 'project': return <SparklesIcon className="w-6 h-6 text-white" />;
        default: return null;
    }
};

const TimelineItem: React.FC<{ event: TimelineEvent; index: number }> = ({ event, index }) => {
    const isLeft = index % 2 === 0;
    return (
        <div className="mb-8 flex justify-between items-center w-full">
            {isLeft ? (
                <>
                    <div className="order-1 w-5/12"></div>
                    <div className="z-20 flex items-center order-1 bg-[#D08A64] shadow-xl w-12 h-12 rounded-full">
                        {getIconForType(event.type)}
                    </div>
                    <div className="order-1 bg-white rounded-lg shadow-xl w-5/12 px-6 py-4">
                        <p className="mb-2 text-sm font-bold text-[#D08A64]">{event.year}</p>
                        <h3 className="mb-3 font-bold text-gray-800 text-lg">{event.title}</h3>
                        <p className="text-sm leading-snug tracking-wide text-gray-600">{event.description}</p>
                    </div>
                </>
            ) : (
                <>
                    <div className="order-1 bg-white rounded-lg shadow-xl w-5/12 px-6 py-4">
                        <p className="mb-2 text-sm font-bold text-[#D08A64] text-right">{event.year}</p>
                        <h3 className="mb-3 font-bold text-gray-800 text-lg text-right">{event.title}</h3>
                        <p className="text-sm leading-snug tracking-wide text-gray-600 text-right">{event.description}</p>
                    </div>
                    <div className="z-20 flex items-center order-1 bg-[#D08A64] shadow-xl w-12 h-12 rounded-full">
                        {getIconForType(event.type)}
                    </div>
                    <div className="order-1 w-5/12"></div>
                </>
            )}
        </div>
    );
};

const About: React.FC = () => {
    const [profileImage, setProfileImage] = useState<string | null>(null);

    useEffect(() => {
        const loadProfileImage = async () => {
            try {
                const imageUrl = await getProfileImage();
                setProfileImage(imageUrl);
            } catch (error) {
                console.error('Error loading profile image:', error);
            }
        };
        loadProfileImage();
    }, []);

    const defaultImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23EAD7C4' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='48' fill='%23D08A64' text-anchor='middle' dy='.3em'%3EFC%3C/text%3E%3C/svg%3E";

    return (
        <section id="sobre-mi" className="min-h-screen animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">Sobre Mí</h2>

            <div className="max-w-4xl mx-auto bg-white/50 p-8 md:p-12 rounded-2xl shadow-lg mb-16 backdrop-blur-sm">
                 <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                     <div className="flex-shrink-0 w-48 h-48 md:w-56 md:h-56">
                        <img 
                            src={profileImage || defaultImage}/4QCARXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAACsKADAAQAAAABAAAC0AAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgC0AKwAwEiAAIRAAMRAP/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAAQEBAQEBAgEBAgMCAgIDBAMDAwMEBQQEBAQEBQYFBQUFBQUGBgYGBgYGBgcHBwcHBwgICAgICQkJCQkJCQkJCf/bAEMBAQEBAgICBAICBAkGBQYJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCf/dAAQAKv/aAAwDAQACEQMRAD8A/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKK-iiigAooooAKKKKAP//Z"
                            alt="Foto de Florencia Cosmedi"
                            className="w-full h-full rounded-full object-cover object-center shadow-xl border-4 border-white"
                        />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <p className="text-2xl font-semibold text-[#D08A64] mb-6">¡Hola! Soy Florencia Cosmedi, técnica en Diseño, Imagen y Sonido.</p>
                        <div className="text-gray-700 space-y-4 text-lg">
                             <p>Me apasiona crear experiencias visuales y audiovisuales que conecten, emocionen y comuniquen con propósito. Mi enfoque combina la creatividad, la estética y la funcionalidad, buscando siempre transmitir ideas de forma clara, atractiva y con identidad propia.</p>
                        </div>
                    </div>
                </div>
                <div className="text-gray-700 space-y-4 text-lg mt-8">
                    <p>Trabajo desde una mirada integral del diseño: pienso en cómo se ve, cómo suena y cómo se siente cada proyecto. Me motiva desarrollar propuestas que hablen por sí solas, con una identidad cálida, moderna y humana.</p>
                    <p>Me muestro tal cual soy: profesional, cercana y detallista, con una gran curiosidad por las nuevas tendencias visuales y tecnológicas. Cada trabajo es una oportunidad para transformar una idea en algo visualmente poderoso y emocionalmente significativo.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto bg-white/50 p-8 md:p-12 rounded-2xl shadow-lg mb-16 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Lo que me diferencia</h3>
                <div className="text-gray-700 space-y-4 text-lg">
                    <p>Es mi forma de entender el diseño como una experiencia completa, no solo como algo visual. No pienso solo en colores o formas, sino en cómo una imagen suena, transmite y emociona.</p>
                    <p>Mi formación en Diseño, Imagen y Sonido me permite unir lo visual con lo sensorial, logrando proyectos que comunican de manera más profunda y auténtica.</p>
                    <p>A diferencia de otros perfiles más técnicos o estéticos, mi enfoque está en crear conexiones reales: que cada pieza tenga propósito, identidad y emoción. Soy detallista, observadora y curiosa: busco siempre ir más allá de lo obvio, combinar lo artístico con lo funcional y darle un toque humano a todo lo que hago.</p>
                    <p>Además, me gusta mantener una estética alegre, moderna y cercana, cuidando que cada proyecto refleje la esencia de quien lo comunica, no solo que “se vea bien”.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto mb-16">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Habilidades</h3>
                <div className="flex flex-wrap justify-center gap-3">
                    {SKILLS.map((skill, index) => (
                        <span key={index} className="bg-[#EAD7C4] text-gray-800 text-sm font-semibold px-4 py-2 rounded-full shadow-sm transition-transform duration-300 hover:scale-105 hover:bg-[#D08A64] hover:text-white">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-10 text-center">Mi Trayectoria</h3>
                <div className="relative wrap overflow-hidden p-2 h-full">
                    <div className="border-2-2 absolute border-opacity-20 border-[#C49E85] h-full border" style={{ left: '50%' }}></div>
                    {TIMELINE_EVENTS.map((event, index) => (
                        <TimelineItem key={index} event={event} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;