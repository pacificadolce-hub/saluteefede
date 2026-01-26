-- 1. Inserisci altri 3 NUOVI pacchetti con immagini bellissime
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
  'Energia Vitale & Salmi', 
  'energia-vitale', 
  'Ritrova la tua carica naturale eliminando la stanchezza cronica.', 
  'Un programma pensato per chi si sente sempre stanco. Impara a combinare cibi energetici naturali con la potenza rigenerante della preghiera sui Salmi. Un mix perfetto per affrontare le giornate con vigore.', 
  35.00, 
  14, 
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1000&auto=format&fit=crop', 
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1000&auto=format&fit=crop'
  ]), 
  to_jsonb(ARRAY['Guida energetica', 'Meditazioni mattutine']), 
  true, 
  true,
  'Ecco la tua guida per ritrovare energia!',
  'https://www.example.com/energia.pdf'
),
(
  'Sonno Sereno & Pace', 
  'sonno-sereno', 
  'Una routine serale biblica per combattere insonnia e ansia.', 
  'Dormire bene è un dono di Dio. Questo pacchetto ti insegna quali cibi favoriscono il sonno (come mandorle e camomilla) e ti guida in una routine di preghiera serale per lasciare ogni ansia ai piedi della croce prima di dormire.', 
  25.00, 
  10, 
  'https://images.unsplash.com/photo-1511295748125-953f266180c4?q=80&w=1000&auto=format&fit=crop', 
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1520206183501-b80df61043c2?q=80&w=1000&auto=format&fit=crop'
  ]), 
  to_jsonb(ARRAY['Tisane Bibliche', 'Versetti per dormire']), 
  true, 
  true,
  'Sogni d''oro e benedizioni.',
  'https://www.example.com/sonno.pdf'
),
(
  'Famiglia in Salute', 
  'famiglia-salute', 
  'Ricette sane e veloci che piacciono anche ai bambini.', 
  'Porta la salute nella tua casa senza litigare a tavola. Ricette semplici, nutrienti e colorate per tutta la famiglia, unite a consigli per educare i figli alla gratitudine verso il cibo che Dio ci dona.', 
  55.00, 
  30, 
  'https://images.unsplash.com/photo-1505935428862-770b6f24f629?q=80&w=1000&auto=format&fit=crop', 
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1506485331710-dc6010d84f22?q=80&w=1000&auto=format&fit=crop'
  ]), 
  to_jsonb(ARRAY['Ricette per bambini', 'Giochi da tavola benedetti']), 
  true, 
  false,
  'Buon appetito a tutta la famiglia!',
  'https://www.example.com/famiglia.pdf'
);
