import type { Project, TimelineEvent } from './types.ts';

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Cortometraje "Amanecer"',
    category: 'Video',
    description: 'Pieza audiovisual experimental que explora la relación entre la luz y la melancolía.',
    tools: ['Adobe Premiere Pro', 'DaVinci Resolve', 'Canon EOS R5'],
    thumbnailUrl: 'https://picsum.photos/seed/amanecer/600/400',
    externalUrl: '#',
  },
  {
    id: 2,
    title: 'Fotografía de Producto "Esencia"',
    category: 'Fotografía',
    description: 'Serie fotográfica para una marca de cosméticos naturales, enfocada en la textura y la calidez.',
    tools: ['Adobe Photoshop', 'Lightroom', 'Sony A7III'],
    thumbnailUrl: 'https://picsum.photos/seed/esencia/600/400',
    externalUrl: '#',
  },
  {
    id: 3,
    title: 'Diseño Sonoro "Ciudad Latente"',
    category: 'Sonido',
    description: 'Composición sonora que captura el pulso de la ciudad durante la noche.',
    tools: ['Ableton Live', 'Pro Tools', 'Zoom H6'],
    thumbnailUrl: 'https://picsum.photos/seed/ciudad/600/400',
    externalUrl: '#',
  },
  {
    id: 4,
    title: 'Video Institucional "Innovar"',
    category: 'Video',
    description: 'Producción para una startup tecnológica, comunicando su visión y valores de forma dinámica.',
    tools: ['Adobe After Effects', 'Premiere Pro'],
    thumbnailUrl: 'https://picsum.photos/seed/innovar/600/400',
    externalUrl: '#',
  },
  {
    id: 5,
    title: 'Videoclip "Ritmo Interior"',
    category: 'Video',
    description: 'Dirección y montaje para el videoclip de un artista emergente, con foco en el storytelling visual.',
    tools: ['Final Cut Pro', 'DaVinci Resolve'],
    thumbnailUrl: 'https://picsum.photos/seed/ritmo/600/400',
    externalUrl: '#',
  },
  {
    id: 6,
    title: 'Instalación Audiovisual "Memorias"',
    category: 'Instalación',
    description: 'Proyecto inmersivo que combina video proyecciones y sonido envolvente.',
    tools: ['TouchDesigner', 'Resolume Arena', 'Ableton Live'],
    thumbnailUrl: 'https://picsum.photos/seed/memorias/600/400',
    externalUrl: '#',
  },
  {
    id: 7,
    title: 'Flyer Evento Musical',
    category: 'Flyers',
    description: 'Diseño de flyer para festival de música indie, enfocado en una estética vibrante y juvenil.',
    tools: ['Adobe Illustrator', 'Adobe Photoshop'],
    thumbnailUrl: 'https://picsum.photos/seed/flyer1/600/400',
    externalUrl: '#',
  },
];

export const SKILLS: string[] = [
  'Diseño Audiovisual',
  'Edición de Video',
  'Diseño Sonoro',
  'Colorimetría',
  'Montaje',
  'Dirección de Arte',
  'Storytelling',
  'Fotografía',
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: '2025',
    title: 'Inicio de Formación',
    description: 'Comencé mis estudios en la Tecnicatura de Diseño, Imagen y Sonido.',
    type: 'education',
  },
  {
    year: '2025',
    title: 'Primer Proyecto Freelance',
    description: 'Realizo manejo de redes sociales en el emprendimiento de florcosmedi08.',
    type: 'project',
  },
  {
    year: '2022',
    title: 'Técnica en Diseño, Imagen y Sonido',
    description: 'Me gradué con un proyecto final enfocado en el diseño sonoro inmersivo.',
    type: 'education',
  },
  {
    year: '2023',
    title: 'Editora Junior en "Visión Creativa"',
    description: 'Me uní a un estudio de producción audiovisual, participando en proyectos comerciales y artísticos.',
    type: 'experience',
  },
  {
    year: 'Actualidad',
    title: 'Diseñadora Audiovisual Freelance',
    description: 'Desarrollo proyectos integrales para clientes y colaboro con distintas agencias y productoras.',
    type: 'experience',
  },
];