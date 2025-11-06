
import React, { useState } from 'react';
import type { UploadedFile, Project } from '../types.ts';
import { uploadFile, deleteFile, uploadProfileImage } from '../lib/projectsService.ts';

const UploadIcon = ({ className = 'w-12 h-12' }: { className?: string }) => (
    <svg className={className} stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const TrashIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);

const FileCard: React.FC<{ file: UploadedFile; onDelete: () => void; isDeleting?: boolean }> = ({ file, onDelete, isDeleting = false }) => {
    return (
        <div className="relative group bg-white/70 rounded-lg shadow-md overflow-hidden">
            {isDeleting && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <div className="text-white text-sm">Eliminando...</div>
                </div>
            )}
            {file.type === 'image' ? (
                <img src={file.url} alt={file.name} className="w-full h-40 object-cover" />
            ) : (
                <video src={file.url} controls className="w-full h-40 object-cover"></video>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                <p className="text-white text-xs truncate">{file.name}</p>
            </div>
            <button
                onClick={onDelete}
                disabled={isDeleting}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Eliminar archivo"
            >
                <TrashIcon />
            </button>
        </div>
    );
};

interface AdminPanelProps {
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    onRefresh?: () => Promise<void>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ projects, setProjects, onRefresh }) => {
    const [uploading, setUploading] = useState<Record<string, boolean>>({});
    const [deleting, setDeleting] = useState<Record<string, boolean>>({});
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = async (files: FileList | null, type: 'image' | 'video', projectId: number) => {
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);
        setError(null);

        for (const file of fileArray) {
            // Validar tipo de archivo
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            
            if (type === 'image' && !isImage) {
                setError(`El archivo ${file.name} no es una imagen válida`);
                continue;
            }
            if (type === 'video' && !isVideo) {
                setError(`El archivo ${file.name} no es un video válido`);
                continue;
            }

            const uploadKey = `${projectId}-${file.name}`;
            setUploading(prev => ({ ...prev, [uploadKey]: true }));

            try {
                const uploadedFile = await uploadFile(file, projectId);
                
                if (uploadedFile) {
                    // Actualizar el estado local
                    setProjects(prevProjects => prevProjects.map(p => {
                        if (p.id === projectId) {
                            const newMedia = p.media ? [...p.media, uploadedFile] : [uploadedFile];
                            return { ...p, media: newMedia };
                        }
                        return p;
                    }));

                    // Refrescar desde Supabase para asegurar sincronización
                    if (onRefresh) {
                        await onRefresh();
                    }
                }
            } catch (err) {
                console.error('Error uploading file:', err);
                setError(`Error al subir ${file.name}: ${err instanceof Error ? err.message : 'Error desconocido'}`);
            } finally {
                setUploading(prev => {
                    const newState = { ...prev };
                    delete newState[uploadKey];
                    return newState;
                });
            }
        }
    };

    const handleDelete = async (projectId: number, fileId: string, fileUrl: string) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este archivo?')) {
            return;
        }

        setDeleting(prev => ({ ...prev, [fileId]: true }));
        setError(null);

        try {
            // La función deleteFile puede obtener el file_path de la BD si no se proporciona
            await deleteFile(fileId);

            // Actualizar el estado local
            setProjects(prevProjects => prevProjects.map(p => {
                if (p.id === projectId) {
                    return { ...p, media: (p.media || []).filter(f => f.id !== fileId) };
                }
                return p;
            }));

            // Refrescar desde Supabase
            if (onRefresh) {
                await onRefresh();
            }
        } catch (err) {
            console.error('Error deleting file:', err);
            setError(`Error al eliminar el archivo: ${err instanceof Error ? err.message : 'Error desconocido'}`);
        } finally {
            setDeleting(prev => {
                const newState = { ...prev };
                delete newState[fileId];
                return newState;
            });
        }
    };

    const UploadArea: React.FC<{ type: 'image' | 'video', projectId: number}> = ({ type, projectId }) => (
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#D08A64] border-dashed rounded-md h-full">
            <div className="space-y-1 text-center flex flex-col justify-center">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                    <label htmlFor={`${type}-upload-${projectId}`} className="relative cursor-pointer bg-white rounded-md font-medium text-[#C49E85] hover:text-[#D08A64] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#D08A64]">
                        <span>Sube un archivo</span>
                        <input id={`${type}-upload-${projectId}`} name={`${type}-upload-${projectId}`} type="file" className="sr-only" multiple accept={type === 'image' ? 'image/*' : 'video/*'} onChange={(e) => handleFileUpload(e.target.files, type, projectId)} />
                    </label>
                    <p className="pl-1">o arrástralo aquí</p>
                </div>
                <p className="text-xs text-gray-500">
                    {type === 'image' ? 'PNG, JPG, etc.' : 'MP4, WEBM, etc.'}
                </p>
            </div>
        </div>
    );
    
    const handleProfileImageUpload = async (file: File | null) => {
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            setError('Por favor, sube solo archivos de imagen');
            return;
        }

        setError(null);
        setUploading(prev => ({ ...prev, 'profile': true }));

        try {
            await uploadProfileImage(file);
            if (onRefresh) {
                await onRefresh();
            }
            alert('Imagen de perfil actualizada correctamente. Recarga la página para ver los cambios.');
        } catch (err) {
            console.error('Error uploading profile image:', err);
            setError(`Error al subir la imagen: ${err instanceof Error ? err.message : 'Error desconocido'}`);
        } finally {
            setUploading(prev => {
                const newState = { ...prev };
                delete newState['profile'];
                return newState;
            });
        }
    };

    return (
        <section id="panel" className="min-h-screen animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">Panel de Administración</h2>
            
            {/* Sección de Imagen de Perfil */}
            <div className="max-w-2xl mx-auto bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg mb-12">
                <h3 className="text-2xl font-bold text-gray-700 mb-4">Imagen de Perfil (Sección "Sobre Mí")</h3>
                <div className="mt-4">
                    <label htmlFor="profile-image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#C49E85] hover:text-[#D08A64] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#D08A64] inline-block px-4 py-2 border border-[#D08A64] rounded-lg">
                        <span>Subir Imagen de Perfil</span>
                        <input 
                            id="profile-image-upload" 
                            name="profile-image-upload" 
                            type="file" 
                            className="sr-only" 
                            accept="image/*" 
                            onChange={(e) => handleProfileImageUpload(e.target.files?.[0] || null)} 
                        />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">La imagen aparecerá en la sección "Sobre Mí"</p>
                    {uploading['profile'] && (
                        <p className="text-sm text-blue-600 mt-2">Subiendo imagen...</p>
                    )}
                </div>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">Gestionar Proyectos</h3>
            
            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <p className="font-semibold">Error:</p>
                    <p>{error}</p>
                    <button 
                        onClick={() => setError(null)}
                        className="mt-2 text-sm underline"
                    >
                        Cerrar
                    </button>
                </div>
            )}
            
            <div className="space-y-12">
                {projects.map(project => (
                    <div key={project.id} className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-700 mb-6">{project.title}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-600 mb-2">Subir Imágenes</h4>
                                <UploadArea type="image" projectId={project.id} />
                            </div>
                             <div>
                                <h4 className="text-lg font-semibold text-gray-600 mb-2">Subir Videos</h4>
                                <UploadArea type="video" projectId={project.id} />
                            </div>
                        </div>

                        <h4 className="text-xl font-semibold text-gray-600 mt-8 mb-4">Archivos Subidos</h4>
                        {(project.media && project.media.length > 0) ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {project.media.map(file => (
                                    <FileCard 
                                        key={file.id} 
                                        file={file} 
                                        onDelete={() => handleDelete(project.id, file.id, file.url)}
                                        isDeleting={deleting[file.id] || false}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No hay archivos para este proyecto.</p>
                        )}
                        
                        {(Object.keys(uploading).length > 0) && (
                            <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
                                <p className="text-sm">Subiendo archivos...</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AdminPanel;