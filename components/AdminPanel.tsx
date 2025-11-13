
import React, { useState, useEffect } from 'react';
import type { UploadedFile, Project, MarketingItem } from '../types.ts';
import { uploadFile, deleteFile, uploadProfileImage, deleteProject, updateProject } from '../lib/projectsService.ts';
import { 
    getMarketingItems, 
    createMarketingItem, 
    updateMarketingItem, 
    deleteMarketingItem, 
    uploadMarketingImage 
} from '../lib/marketingService.ts';

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
    const [marketingItems, setMarketingItems] = useState<MarketingItem[]>([]);
    const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<Project>>({});
    const [saving, setSaving] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const loadMarketingItems = async () => {
            try {
                const items = await getMarketingItems();
                setMarketingItems(items);
            } catch (error) {
                console.error('Error loading marketing items:', error);
            }
        };
        loadMarketingItems();
    }, []);

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

    const handleDeleteProject = async (projectId: number, projectTitle: string) => {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar el proyecto "${projectTitle}"?\n\nEsta acción eliminará el proyecto y TODOS sus archivos multimedia. Esta acción NO se puede deshacer.`)) {
            return;
        }

        const deleteKey = `project-${projectId}`;
        setDeleting(prev => ({ ...prev, [deleteKey]: true }));
        setError(null);

        try {
            await deleteProject(projectId);

            // Actualizar el estado local
            setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));

            // Refrescar desde Supabase
            if (onRefresh) {
                await onRefresh();
            }

            alert(`Proyecto "${projectTitle}" eliminado exitosamente`);
        } catch (err) {
            console.error('Error deleting project:', err);
            setError(`Error al eliminar el proyecto: ${err instanceof Error ? err.message : 'Error desconocido'}`);
        } finally {
            setDeleting(prev => {
                const newState = { ...prev };
                delete newState[deleteKey];
                return newState;
            });
        }
    };

    const handleStartEdit = (project: Project) => {
        setEditingProjectId(project.id);
        setEditFormData({
            title: project.title,
            category: project.category,
            description: project.description,
            tools: [...project.tools],
            thumbnailUrl: project.thumbnailUrl,
            externalUrl: project.externalUrl || '',
        });
    };

    const handleCancelEdit = () => {
        setEditingProjectId(null);
        setEditFormData({});
    };

    const handleSaveEdit = async (projectId: number) => {
        const saveKey = `project-${projectId}`;
        setSaving(prev => ({ ...prev, [saveKey]: true }));
        setError(null);

        try {
            const updatedProject = await updateProject({
                id: projectId,
                ...editFormData,
            });

            if (updatedProject) {
                // Actualizar el estado local
                setProjects(prevProjects => prevProjects.map(p => 
                    p.id === projectId ? updatedProject : p
                ));

                // Refrescar desde Supabase
                if (onRefresh) {
                    await onRefresh();
                }

                setEditingProjectId(null);
                setEditFormData({});
                alert('Proyecto actualizado exitosamente');
            }
        } catch (err) {
            console.error('Error updating project:', err);
            setError(`Error al actualizar el proyecto: ${err instanceof Error ? err.message : 'Error desconocido'}`);
        } finally {
            setSaving(prev => {
                const newState = { ...prev };
                delete newState[saveKey];
                return newState;
            });
        }
    };

    const handleToolChange = (index: number, value: string) => {
        const newTools = [...(editFormData.tools || [])];
        newTools[index] = value;
        setEditFormData({ ...editFormData, tools: newTools });
    };

    const handleAddTool = () => {
        const newTools = [...(editFormData.tools || []), ''];
        setEditFormData({ ...editFormData, tools: newTools });
    };

    const handleRemoveTool = (index: number) => {
        const newTools = [...(editFormData.tools || [])];
        newTools.splice(index, 1);
        setEditFormData({ ...editFormData, tools: newTools });
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
    
    const handleMarketingImageUpload = async (file: File | null, itemId?: number) => {
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            setError('Por favor, selecciona un archivo de imagen válido.');
            return;
        }

        try {
            const uploadKey = itemId ? `marketing-${itemId}` : 'marketing-new';
            setUploading(prev => ({ ...prev, [uploadKey]: true }));
            setError(null);

            const imageUrl = await uploadMarketingImage(file);
            if (!imageUrl) throw new Error('No se pudo obtener la URL de la imagen');

            if (itemId) {
                // Actualizar imagen existente
                await updateMarketingItem(itemId, { image_url: imageUrl });
                const updatedItems = await getMarketingItems();
                setMarketingItems(updatedItems);
            } else {
                // Guardar URL para nuevo item
                return imageUrl;
            }
        } catch (err: any) {
            console.error('Error uploading marketing image:', err);
            setError(err.message || 'Error al subir la imagen de marketing');
        } finally {
            setUploading(prev => {
                const newState = { ...prev };
                delete newState[itemId ? `marketing-${itemId}` : 'marketing-new'];
                return newState;
            });
        }
    };

    const handleCreateMarketingItem = async (imageUrl: string) => {
        try {
            setUploading(prev => ({ ...prev, 'marketing-create': true }));
            setError(null);

            const newItem = await createMarketingItem(imageUrl);

            if (newItem) {
                const updatedItems = await getMarketingItems();
                setMarketingItems(updatedItems);
            }
        } catch (err: any) {
            console.error('Error creating marketing item:', err);
            setError(err.message || 'Error al crear el elemento de marketing');
        } finally {
            setUploading(prev => {
                const newState = { ...prev };
                delete newState['marketing-create'];
                return newState;
            });
        }
    };


    const handleDeleteMarketingItem = async (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este elemento de marketing?')) {
            return;
        }

        try {
            setDeleting(prev => ({ ...prev, [`marketing-${id}`]: true }));
            setError(null);

            await deleteMarketingItem(id);
            const updatedItems = await getMarketingItems();
            setMarketingItems(updatedItems);
        } catch (err: any) {
            console.error('Error deleting marketing item:', err);
            setError(err.message || 'Error al eliminar el elemento de marketing');
        } finally {
            setDeleting(prev => {
                const newState = { ...prev };
                delete newState[`marketing-${id}`];
                return newState;
            });
        }
    };


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

            {/* Sección de Marketing */}
            <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg mb-12">
                <h3 className="text-2xl font-bold text-gray-700 mb-6">Gestionar Marketing</h3>
                
                {/* Formulario para nuevo elemento de marketing */}
                <div className="bg-white/50 p-6 rounded-xl mb-6">
                    <h4 className="text-xl font-semibold text-gray-700 mb-4">Agregar Nueva Imagen de Marketing</h4>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="marketing-image-new" className="block text-sm font-medium text-gray-700 mb-2">
                                Imagen <span className="text-red-500">*</span>
                            </label>
                            <div className="border-2 border-dashed border-[#D08A64] rounded-lg p-6 text-center hover:border-[#C49E85] transition-colors">
                                <input
                                    id="marketing-image-new"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="sr-only"
                                    onChange={async (e) => {
                                        const files = e.target.files;
                                        if (files && files.length > 0) {
                                            for (let i = 0; i < files.length; i++) {
                                                const file = files[i];
                                                const imageUrl = await handleMarketingImageUpload(file);
                                                if (imageUrl) {
                                                    await handleCreateMarketingItem(imageUrl);
                                                }
                                            }
                                        }
                                    }}
                                />
                                <label
                                    htmlFor="marketing-image-new"
                                    className="relative cursor-pointer flex flex-col items-center"
                                >
                                    <svg className="w-12 h-12 text-[#D08A64] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm font-medium text-[#C49E85] hover:text-[#D08A64]">
                                        Haz clic para seleccionar una o más imágenes
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF hasta 10MB cada una</span>
                                </label>
                            </div>
                            {uploading['marketing-new'] && (
                                <p className="text-sm text-blue-600 mt-2">Subiendo imagen(es)...</p>
                            )}
                        </div>
                        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                            <p className="font-semibold mb-1">Nota:</p>
                            <p>Cada imagen se publicará independientemente. Puedes seleccionar múltiples imágenes a la vez.</p>
                        </div>
                    </div>
                </div>

                {/* Lista de elementos de marketing existentes */}
                <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-700 mb-4">Imágenes de Marketing ({marketingItems.length})</h4>
                    {marketingItems.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No hay imágenes de marketing aún.</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {marketingItems.map((item) => (
                                <div key={item.id} className="bg-white/50 p-4 rounded-xl border border-gray-200 relative group">
                                    <div className="relative aspect-square mb-3">
                                        <img
                                            src={item.image_url}
                                            alt={item.title || 'Imagen de marketing'}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                        <button
                                            onClick={() => handleDeleteMarketingItem(item.id)}
                                            disabled={deleting[`marketing-${item.id}`]}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label="Eliminar imagen"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    {deleting[`marketing-${item.id}`] && (
                                        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                                            <p className="text-white text-sm">Eliminando...</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
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
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-2xl font-bold text-gray-700">
                                {editingProjectId === project.id ? 'Editando Proyecto' : project.title}
                            </h3>
                            <div className="flex gap-2">
                                {editingProjectId === project.id ? (
                                    <>
                                        <button
                                            onClick={() => handleSaveEdit(project.id)}
                                            disabled={saving[`project-${project.id}`]}
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Guardar</span>
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            disabled={saving[`project-${project.id}`]}
                                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <XIcon className="w-5 h-5" />
                                            <span>Cancelar</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleStartEdit(project)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                                            aria-label={`Editar proyecto ${project.title}`}
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            <span>Editar</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProject(project.id, project.title)}
                                            disabled={deleting[`project-${project.id}`]}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label={`Eliminar proyecto ${project.title}`}
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                            <span>Eliminar</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        {deleting[`project-${project.id}`] && (
                            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-yellow-800 text-sm">Eliminando proyecto y sus archivos...</p>
                            </div>
                        )}
                        {saving[`project-${project.id}`] && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-blue-800 text-sm">Guardando cambios...</p>
                            </div>
                        )}
                        
                        {/* Formulario de edición */}
                        {editingProjectId === project.id && (
                            <div className="bg-white/50 p-6 rounded-xl mb-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Título <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editFormData.title || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D08A64] focus:border-transparent"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Categoría <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editFormData.category || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D08A64] focus:border-transparent"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Descripción <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={editFormData.description || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D08A64] focus:border-transparent"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Herramientas
                                    </label>
                                    <div className="space-y-2">
                                        {(editFormData.tools || []).map((tool, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={tool}
                                                    onChange={(e) => handleToolChange(index, e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D08A64] focus:border-transparent"
                                                    placeholder="Nombre de la herramienta"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTool(index)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={handleAddTool}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm"
                                        >
                                            + Agregar Herramienta
                                        </button>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        URL de Miniatura <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editFormData.thumbnailUrl || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, thumbnailUrl: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D08A64] focus:border-transparent"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        URL Externa (opcional)
                                    </label>
                                    <input
                                        type="text"
                                        value={editFormData.externalUrl || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, externalUrl: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D08A64] focus:border-transparent"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        )}
                        
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