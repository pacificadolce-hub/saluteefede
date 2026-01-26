import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Eye,
  EyeOff,
  Star,
  Upload,
  Image,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../services/api';
import { uploadFile } from '../../services/supabase';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PackageManager = () => {
  const { getAccessToken } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    name: '',
    slug: '',
    description: '',
    short_description: '',
    price: '',
    duration_days: '',
    image_url: '',
    gallery_images: [],
    pdf_url: '',
    recipe_pdf_url: '',
    shopping_list_url: '',
    features: [],
    is_active: true,
    is_featured: false,
    email_content: '',
    email_attachment_url: '',
  };

  const [formData, setFormData] = useState(emptyForm);
  const [initialFormData, setInitialFormData] = useState(emptyForm);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const token = getAccessToken();
      const data = await adminApi.getPackages(token);
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (value) => {
    setFormData({
      ...formData,
      name: value,
      slug: editingPackage ? formData.slug : generateSlug(value),
    });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const bucket = field.includes('pdf') ? 'pdfs' : 'images';
      const path = `packages/${Date.now()}_${file.name}`;
      const url = await uploadFile(bucket, path, file);
      setFormData({ ...formData, [field]: url });
    } catch (error) {
      alert('Errore durante il caricamento del file');
    } finally {
      setUploading(false);
    }
  };

  const handleMultipleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const path = `packages/gallery/${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${file.name}`;
        return await uploadFile('images', path, file);
      });
      const urls = await Promise.all(uploadPromises);
      setFormData({
        ...formData,
        gallery_images: [...(formData.gallery_images || []), ...urls],
      });
    } catch (error) {
      alert('Errore durante il caricamento delle immagini');
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index) => {
    setFormData({
      ...formData,
      gallery_images: formData.gallery_images.filter((_, i) => i !== index),
    });
  };

  const openModal = (pkg = null) => {
    let data;
    if (pkg) {
      setEditingPackage(pkg);
      data = {
        name: pkg.name || '',
        slug: pkg.slug || '',
        description: pkg.description || '',
        short_description: pkg.short_description || '',
        price: pkg.price || '',
        duration_days: pkg.duration_days || '',
        image_url: pkg.image_url || '',
        gallery_images: pkg.gallery_images || [],
        pdf_url: pkg.pdf_url || '',
        recipe_pdf_url: pkg.recipe_pdf_url || '',
        shopping_list_url: pkg.shopping_list_url || '',
        features: pkg.features || [],
        is_active: pkg.is_active ?? true,
        is_featured: pkg.is_featured ?? false,
        email_content: pkg.email_content || '',
        email_attachment_url: pkg.email_attachment_url || '',
      };
    } else {
      setEditingPackage(null);
      data = emptyForm;
    }
    setFormData(data);
    setInitialFormData(JSON.parse(JSON.stringify(data)));
    setShowModal(true);
  };

  const hasUnsavedChanges = useCallback(() => {
    return showModal && JSON.stringify(formData) !== JSON.stringify(initialFormData);
  }, [showModal, formData, initialFormData]);

  // Blocca chiusura browser/refresh
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleCloseModal = () => {
    if (hasUnsavedChanges()) {
      if (!confirm('Hai modifiche non salvate. Vuoi uscire senza salvare?')) {
        return;
      }
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPackage(null);
    setFormData(emptyForm);
    setInitialFormData(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = getAccessToken();
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        duration_days: formData.duration_days ? parseInt(formData.duration_days) : null,
      };

      if (editingPackage) {
        await adminApi.updatePackage(token, editingPackage.id, data);
      } else {
        await adminApi.createPackage(token, data);
      }

      await fetchPackages();
      closeModal();
    } catch (error) {
      console.error('Save error:', error);
      alert('Errore durante il salvataggio: ' + (error.message || 'Errore sconosciuto'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questo pacchetto?')) return;

    try {
      const token = getAccessToken();
      await adminApi.deletePackage(token, id);
      await fetchPackages();
    } catch (error) {
      alert('Errore durante l\'eliminazione');
    }
  };

  const toggleActive = async (pkg) => {
    try {
      const token = getAccessToken();
      await adminApi.updatePackage(token, pkg.id, { is_active: !pkg.is_active });
      await fetchPackages();
    } catch (error) {
      alert('Errore durante l\'aggiornamento');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Gestione Pacchetti</h1>
          <p className="text-gray-600">Crea e gestisci i pacchetti dieta</p>
        </div>
        <button onClick={() => openModal()} className="btn btn-primary">
          <Plus size={20} />
          Nuovo Pacchetto
        </button>
      </div>

      {/* Packages Grid */}
      {packages.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <p className="text-gray-500 mb-4">Nessun pacchetto creato</p>
          <button onClick={() => openModal()} className="btn btn-primary">
            Crea il primo pacchetto
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              className={`bg-white rounded-xl shadow-sm overflow-hidden ${!pkg.is_active ? 'opacity-60' : ''}`}
            >
              <div className="relative h-40 bg-gradient-to-br from-primary/20 to-primary/5">
                {(pkg.image_url || (pkg.gallery_images && pkg.gallery_images.length > 0)) ? (
                  <img src={pkg.image_url || pkg.gallery_images[0]} alt={pkg.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🥗</div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  {pkg.is_featured && (
                    <span className="bg-accent text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Star size={12} /> Featured
                    </span>
                  )}
                  {!pkg.is_active && (
                    <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                      Disattivo
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{pkg.name}</h3>
                <p className="text-primary font-bold text-lg mb-2">€{pkg.price}</p>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {pkg.short_description || pkg.description}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(pkg)}
                    className="flex-1 btn bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm py-2"
                  >
                    <Pencil size={16} />
                    Modifica
                  </button>
                  <button
                    onClick={() => toggleActive(pkg)}
                    className={`p-2 rounded-lg ${pkg.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                    title={pkg.is_active ? 'Disattiva' : 'Attiva'}
                  >
                    {pkg.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                    title="Elimina"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-black/50"
              onClick={handleCloseModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {editingPackage ? 'Modifica Pacchetto' : 'Nuovo Pacchetto'}
                </h2>
                <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="input"
                      placeholder="Es: Dieta Premium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="input"
                      placeholder="dieta-premium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione breve</label>
                  <input
                    type="text"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    className="input"
                    placeholder="Una frase accattivante"
                    maxLength={500}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione completa</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input resize-none"
                    placeholder="Descrizione dettagliata del pacchetto..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prezzo (€) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="input"
                      placeholder="49.99"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Durata (giorni)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.duration_days}
                      onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                      className="input"
                      placeholder="30"
                    />
                  </div>
                </div>

                {/* Immagine principale */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Immagine Principale</label>
                  {formData.image_url ? (
                    <div className="relative inline-block">
                      <img src={formData.image_url} alt="Preview" className="h-24 w-24 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <label className={`btn bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer w-full justify-center ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                      <span>{uploading ? 'Caricamento...' : 'Carica Immagine'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'image_url')}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>

                {/* Galleria immagini */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Galleria Immagini</label>
                  <p className="text-xs text-gray-500 mb-2">Puoi caricare più immagini insieme. La prima sarà quella principale.</p>
                  <label className={`btn bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer w-full justify-center ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploading ? <Loader2 size={18} className="animate-spin" /> : <Image size={18} />}
                    <span>{uploading ? 'Caricamento...' : 'Aggiungi Immagini'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {formData.gallery_images && formData.gallery_images.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-3">
                      {formData.gallery_images.map((url, index) => (
                        <div key={index} className="relative">
                          <img src={url} alt={`Gallery ${index + 1}`} className="h-20 w-20 object-cover rounded-lg" />
                          <span className="absolute top-1 left-1 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Caratteristiche</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      className="input flex-1"
                      placeholder="Aggiungi caratteristica..."
                    />
                    <button type="button" onClick={addFeature} className="btn btn-primary">
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {feature}
                        <button type="button" onClick={() => removeFeature(index)} className="text-gray-500 hover:text-red-500">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Email Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contenuto Email (inviato all'acquisto)</label>
                  <p className="text-xs text-gray-500 mb-2">Questo testo verrà inviato via email al cliente dopo l'acquisto.</p>
                  <textarea
                    rows={4}
                    value={formData.email_content}
                    onChange={(e) => setFormData({ ...formData, email_content: e.target.value })}
                    className="input resize-none"
                    placeholder="Grazie per l'acquisto! Ecco il tuo link..."
                  />
                </div>

                {/* Email Attachment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allegato/Link Email</label>
                  <p className="text-xs text-gray-500 mb-2">File che il cliente potrà scaricare dall'email.</p>
                  {formData.email_attachment_url ? (
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border">
                      <a href={formData.email_attachment_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate flex-1">
                        {formData.email_attachment_url.split('/').pop()}
                      </a>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, email_attachment_url: '' })}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className={`btn bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer w-full justify-center ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                      <span>{uploading ? 'Caricamento...' : 'Carica File per Email'}</span>
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(e, 'email_attachment_url')}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>

                {/* Toggles */}
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">Attivo</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">In evidenza</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <button type="button" onClick={handleCloseModal} className="btn btn-secondary flex-1">
                    Annulla
                  </button>
                  <button type="submit" disabled={saving} className="btn btn-primary flex-1">
                    {saving ? <LoadingSpinner size="sm" /> : <><Save size={18} /> Salva</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PackageManager;
