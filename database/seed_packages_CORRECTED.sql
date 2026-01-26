-- 1. (Opzionale) Pulisci i pacchetti "vecchi" se vuoi ripartire da zero
-- DELETE FROM packages;

-- 2. Inserisci i nuovi pacchetti con le immagini corrette
INSERT INTO packages (
  name, 
  slug, 
  short_description, 
  description, 
  price, 
  duration_days, 
  image_url, 
  gallery_images, 
  features, 
  is_active, 
  is_featured,
  email_content,
  email_attachment_url
) VALUES 
(
  'Nutrizione Biblica Completa', 
  'nutrizione-biblica-completa', 
  'Un percorso di 30 giorni per riscoprire la salute attraverso gli insegnamenti della Bibbia.', 
  'Scopri i segreti della longevità e del benessere nascosti nelle Scritture. Questo corso completo ti guiderà passo dopo passo verso una nuova consapevolezza alimentare, unendo scienza nutrizionale e saggezza spirituale.', 
  47.00, 
  30, 
  'https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1000&auto=format&fit=crop', 
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=1000&auto=format&fit=crop'
  ]), 
  to_jsonb(ARRAY['Piano alimentare 30 giorni', 'Guida agli alimenti biblici', 'Ricettario completo']), 
  true, 
  true,
  'Grazie per aver scelto il percorso Nutrizione Biblica Completa! Ecco il tuo materiale.',
  'https://www.example.com/guida-completa.pdf'
),
(
  'Il Digiuno di Daniele', 
  'digiuno-daniele', 
  '21 giorni di purificazione fisica e spirituale per ritrovare chiarezza e forza.', 
  'Ispirato al profeta Daniele, questo programma di 21 giorni è progettato per disintossicare il tuo corpo e rinnovare la tua mente.', 
  29.00, 
  21, 
  'https://images.unsplash.com/photo-1511690656952-34342d2c7135?q=80&w=1000&auto=format&fit=crop', 
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505253758473-96b701d8fe62?q=80&w=1000&auto=format&fit=crop'
  ]), 
  to_jsonb(ARRAY['Guida al Digiuno', '21 Devozioni spirituali', 'Lista della spesa settimanale']), 
  true, 
  true,
  'Benvenuto nel Digiuno di Daniele. Ecco la tua guida per iniziare.',
  'https://www.example.com/digiuno-daniele.pdf'
),
(
  'Detox Corpo e Spirito', 
  'detox-corpo-spirito', 
  '7 giorni intensivi per resettare il metabolismo e la vita di preghiera.', 
  'Ti senti appesantito? Questo programma breve ma intenso è perfetto per chi vuole un reset rapido.', 
  19.00, 
  7, 
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1000&auto=format&fit=crop', 
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=1000&auto=format&fit=crop'
  ]), 
  to_jsonb(ARRAY['Menu Detox 7 giorni', 'Schede di preghiera mattutina']), 
  true, 
  false,
  'Pronto per il Detox? Scarica subito il tuo piano settimanale.',
  'https://www.example.com/detox-plan.pdf'
);
