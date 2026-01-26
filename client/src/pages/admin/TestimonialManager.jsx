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
  Loader2,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../services/api';
import { uploadFile } from '../../services/supabase';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TestimonialManager = () => {
  const { getAccessToken } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [uploadingAfter, setUploadingAfter] = useState(false);

  const emptyForm = {
    name: '',
    text: '',
    rating: 5,
    image_url: '',
    before_image_url: '',
    after_image_url: '',
    is_visible: true,
  };

  const [formData, setFormData] = useState(emptyForm);
  const [initialFormData, setInitialFormData] = useState(emptyForm);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const token = getAccessToken();
      const data = await adminApi.getTestimonials(token);
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const path = `testimonials/${Date.now()}_${file.name}`;
      const url = await uploadFile('images', path, file);
      setFormData({ ...formData, image_url: url });
    } catch (error) {
      alert('Errore durante il caricamento dell\'immagine');
    } finally {
      setUploading(false);
    }
  };

  const handleBeforeImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingBefore(true);
    try {
      const path = `testimonials/before/${Date.now()}_${file.name}`;
      const url = await uploadFile('images', path, file);
      setFormData({ ...formData, before_image_url: url });
    } catch (error) {
      alert('Errore durante il caricamento dell\'immagine');
    } finally {
      setUploadingBefore(false);
    }
  };

  const handleAfterImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAfter(true);
    try {
      const path = `testimonials/after/${Date.now()}_${file.name}`;
      const url = await uploadFile('images', path, file);
      setFormData({ ...formData, after_image_url: url });
    } catch (error) {
      alert('Errore durante il caricamento dell\'immagine');
    } finally {
      setUploadingAfter(false);
    }
  };

  const openModal = (testimonial = null) => {
    let data;
    if (testimonial) {
      setEditingTestimonial(testimonial);
      data = {
        name: testimonial.name || '',
        text: testimonial.text || '',
        rating: testimonial.rating || 5,
        image_url: testimonial.image_url || '',
        before_image_url: testimonial.before_image_url || '',
        after_image_url: testimonial.after_image_url || '',
        is_visible: testimonial.is_visible ?? true,
      };
    } else {
      setEditingTestimonial(null);
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
    setEditingTestimonial(null);
    setFormData(emptyForm);
    setInitialFormData(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = getAccessToken();

      if (editingTestimonial) {
        await adminApi.updateTestimonial(token, editingTestimonial.id, formData);
      } else {
        await adminApi.createTestimonial(token, formData);
      }

      await fetchTestimonials();
      closeModal();
    } catch (error) {
      alert('Errore durante il salvataggio');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questa testimonianza?')) return;

    try {
      const token = getAccessToken();
      await adminApi.deleteTestimonial(token, id);
      await fetchTestimonials();
    } catch (error) {
      alert('Errore durante l\'eliminazione');
    }
  };

  const toggleVisibility = async (testimonial) => {
    try {
      const token = getAccessToken();
      await adminApi.updateTestimonial(token, testimonial.id, {
        is_visible: !testimonial.is_visible,
      });
      await fetchTestimonials();
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
          <h1 className="text-2xl font-heading font-bold text-gray-900">Gestione Testimonianze</h1>
          <p className="text-gray-600">Gestisci le recensioni dei clienti</p>
        </div>
        <button onClick={() => openModal()} className="btn btn-primary">
          <Plus size={20} />
          Nuova Testimonianza
        </button>
      </div>

      {/* Testimonials Grid */}
      {testimonials.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4">Nessuna testimonianza creata</p>
          <button onClick={() => openModal()} className="btn btn-primary">
            <Plus size={18} />
            Crea la prima testimonianza
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              className={`bg-white rounded-xl shadow-sm p-6 ${!testimonial.is_visible ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {testimonial.image_url ? (
                    <img
                      src={testimonial.image_url}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < testimonial.rating ? 'text-accent fill-accent' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {!testimonial.is_visible && (
                  <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                    Nascosto
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-4">
                "{testimonial.text}"
              </p>

              {/* Before/After Preview */}
              {(testimonial.before_image_url || testimonial.after_image_url) && (
                <div className="mb-4 p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 mb-2 text-center">Trasformazione</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      {testimonial.before_image_url ? (
                        <img
                          src={testimonial.before_image_url}
                          alt="Prima"
                          className="w-full h-16 rounded object-cover"
                        />
                      ) : (
                        <div className="w-full h-16 rounded bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-400">-</span>
                        </div>
                      )}
                      <span className="text-[10px] text-gray-500">Prima</span>
                    </div>
                    <div className="text-center">
                      {testimonial.after_image_url ? (
                        <img
                          src={testimonial.after_image_url}
                          alt="Dopo"
                          className="w-full h-16 rounded object-cover"
                        />
                      ) : (
                        <div className="w-full h-16 rounded bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-400">-</span>
                        </div>
                      )}
                      <span className="text-[10px] text-gray-500">Dopo</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => openModal(testimonial)}
                  className="flex-1 btn bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm py-2"
                >
                  <Pencil size={16} />
                  Modifica
                </button>
                <button
                  onClick={() => toggleVisibility(testimonial)}
                  className={`p-2 rounded-lg ${testimonial.is_visible ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                  title={testimonial.is_visible ? 'Nascondi' : 'Mostra'}
                >
                  {testimonial.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                  title="Elimina"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal migliorato */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/50"
              onClick={handleCloseModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingTestimonial ? 'Modifica Testimonianza' : 'Nuova Testimonianza'}
                </h2>
                <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Foto profilo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Foto Cliente</label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {formData.image_url ? (
                        <div className="relative">
                          <img
                            src={formData.image_url}
                            alt="Preview"
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image_url: '' })}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                          <User size={32} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className={`btn bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer w-full justify-center ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        {uploading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Caricamento...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={18} />
                            <span>Carica Foto</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Before/After Photos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Prima e Dopo (opzionale)
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Carica le foto della trasformazione del cliente
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Before Photo */}
                    <div className="text-center">
                      <p className="text-xs font-medium text-gray-600 mb-2">PRIMA</p>
                      {formData.before_image_url ? (
                        <div className="relative">
                          <img
                            src={formData.before_image_url}
                            alt="Prima"
                            className="w-full h-32 rounded-lg object-cover border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, before_image_url: '' })}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <label className={`block w-full h-32 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${uploadingBefore ? 'opacity-50 pointer-events-none' : ''}`}>
                          {uploadingBefore ? (
                            <Loader2 size={24} className="animate-spin text-gray-400" />
                          ) : (
                            <div className="text-center">
                              <Upload size={20} className="mx-auto text-gray-400 mb-1" />
                              <span className="text-xs text-gray-500">Carica</span>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBeforeImageUpload}
                            className="hidden"
                            disabled={uploadingBefore}
                          />
                        </label>
                      )}
                    </div>

                    {/* After Photo */}
                    <div className="text-center">
                      <p className="text-xs font-medium text-gray-600 mb-2">DOPO</p>
                      {formData.after_image_url ? (
                        <div className="relative">
                          <img
                            src={formData.after_image_url}
                            alt="Dopo"
                            className="w-full h-32 rounded-lg object-cover border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, after_image_url: '' })}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <label className={`block w-full h-32 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${uploadingAfter ? 'opacity-50 pointer-events-none' : ''}`}>
                          {uploadingAfter ? (
                            <Loader2 size={24} className="animate-spin text-gray-400" />
                          ) : (
                            <div className="text-center">
                              <Upload size={20} className="mx-auto text-gray-400 mb-1" />
                              <span className="text-xs text-gray-500">Carica</span>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAfterImageUpload}
                            className="hidden"
                            disabled={uploadingAfter}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Cliente *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    placeholder="Es: Maria R."
                  />
                </div>

                {/* Testimonianza */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Testo Recensione *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    className="input resize-none"
                    placeholder="Scrivi la recensione del cliente..."
                  />
                </div>

                {/* Valutazione con stelle grandi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valutazione</label>
                  <div className="flex gap-1 bg-gray-50 p-3 rounded-lg justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          size={36}
                          className={`transition-colors ${star <= formData.rating ? 'text-accent fill-accent' : 'text-gray-300 hover:text-gray-400'}`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">{formData.rating} stelle su 5</p>
                </div>

                {/* Visibilità */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_visible}
                      onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="font-medium text-gray-900">Visibile sul sito</span>
                      <p className="text-xs text-gray-500">La testimonianza sarà mostrata pubblicamente</p>
                    </div>
                  </label>
                </div>

                {/* Bottoni */}
                <div className="flex gap-3 pt-4 border-t">
                  <button type="button" onClick={handleCloseModal} className="btn btn-secondary flex-1">
                    Annulla
                  </button>
                  <button type="submit" disabled={saving || uploading || uploadingBefore || uploadingAfter} className="btn btn-primary flex-1">
                    {saving ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Salvataggio...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Salva</span>
                      </>
                    )}
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

export default TestimonialManager;
