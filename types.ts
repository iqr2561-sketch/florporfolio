
// FIX: Import ReactElement to fix "Cannot find namespace 'JSX'" error.
import type { ReactElement } from 'react';

export type Section = 'inicio' | 'sobre-mi' | 'mis-trabajos' | 'marketing' | 'contacto' | 'panel';

export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tools: string[];
  thumbnailUrl: string;
  externalUrl?: string;
  media?: UploadedFile[];
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  type: 'education' | 'experience' | 'project';
}

export interface SocialLink {
  name: string;
  url: string;
  icon: (props: { className?: string }) => ReactElement;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string; // Data URL (Base64)
}

export interface MarketingItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}