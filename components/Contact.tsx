
import React from 'react';
import type { SocialLink } from '../types.ts';

const InstagramIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const YouTubeIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);
const VimeoIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42c-1.2-3.1-4.7-4.1-7.5-2.1-1.2.9-2.6 2.5-4 4.8-1.4-2.3-2.8-3.9-4-4.8C4.24 2.32.74 3.32.46 6.42c-.22 2.3.8 4.7 2.4 7.2 1.5 2.5 3.1 4.7 4.7 6.4 1.6 1.7 3.6 2.6 5.4 2.6s3.8-.9 5.4-2.6c1.6-1.7 3.2-3.9 4.7-6.4 1.6-2.5 2.6-4.9 2.4-7.2z"></path></svg>
);
const BehanceIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 6H12v4h8c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM12 14h6v4h-6zM4 14h4v-4H4v4zm0 6h4v-4H4v4zm0-12h4V4H4v4zm4-4h4v4H8V4zm8 0h4v4h-4V4z"/><rect x="2" y="2" width="20" height="20" rx="2" ry="2" stroke="none" fill="none"></rect><line x1="15" y1="10" x2="15" y2="10" stroke="none"></line><path d="M15 10h-2v4h2c1.1 0 2-.9 2-2s-.9-2-2-2zm-5 0H8v4h2v-4z"></path></svg>
);
const LinkedInIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);


const SOCIAL_LINKS: SocialLink[] = [
    { name: 'Instagram', url: '#', icon: InstagramIcon },
    { name: 'YouTube', url: '#', icon: YouTubeIcon },
    { name: 'Vimeo', url: '#', icon: VimeoIcon },
    { name: 'Behance', url: '#', icon: BehanceIcon },
    { name: 'LinkedIn', url: '#', icon: LinkedInIcon },
];


const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('¡Gracias por tu mensaje! Me pondré en contacto contigo pronto.');
    // Here you would typically handle form submission
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contacto" className="min-h-screen animate-fade-in flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">Hablemos</h2>
        <p className="text-lg text-gray-600 mb-12 text-center">¿Tienes un proyecto en mente? ¡Me encantaría escucharlo!</p>

        <div className="bg-white/60 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-lg flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Envíame un mensaje</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                <input type="text" id="name" name="name" required className="w-full px-4 py-3 bg-[#F2E4D8]/50 border border-[#EAD7C4] rounded-lg focus:ring-2 focus:ring-[#D08A64] focus:border-[#D08A64] transition-colors duration-300" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico</label>
                <input type="email" id="email" name="email" required className="w-full px-4 py-3 bg-[#F2E4D8]/50 border border-[#EAD7C4] rounded-lg focus:ring-2 focus:ring-[#D08A64] focus:border-[#D08A64] transition-colors duration-300" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Mensaje</label>
                <textarea id="message" name="message" rows={5} required className="w-full px-4 py-3 bg-[#F2E4D8]/50 border border-[#EAD7C4] rounded-lg focus:ring-2 focus:ring-[#D08A64] focus:border-[#D08A64] transition-colors duration-300"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full bg-[#D08A64] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#C49E85] transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Enviar Mensaje
                </button>
              </div>
            </form>
          </div>
          <div className="w-full md:w-1/3 flex flex-col justify-center items-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Encuéntrame en</h3>
               <div className="flex flex-wrap justify-center gap-5">
                   {SOCIAL_LINKS.map(link => (
                       <a 
                         key={link.name} 
                         href={link.url} 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="text-gray-500 hover:text-[#D08A64] transition-colors duration-300 transform hover:scale-110"
                         aria-label={link.name}
                       >
                           <link.icon className="w-8 h-8" />
                       </a>
                   ))}
               </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;