-- Schema Database per Salute e Fede
-- Eseguire questo SQL nel SQL Editor di Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Pacchetti dieta
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    duration_days INTEGER,
    image_url TEXT,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    pdf_url TEXT,
    recipe_pdf_url TEXT,
    shopping_list_url TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ordini
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    stripe_payment_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonianze
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
    image_url TEXT,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contatti (messaggi dal form)
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes per performance
CREATE INDEX idx_packages_is_active ON packages(is_active);
CREATE INDEX idx_packages_is_featured ON packages(is_featured);
CREATE INDEX idx_packages_slug ON packages(slug);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_testimonials_is_visible ON testimonials(is_visible);

-- Row Level Security (RLS)
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy per lettura pubblica pacchetti attivi
CREATE POLICY "Public can view active packages" ON packages
    FOR SELECT USING (is_active = true);

-- Policy per lettura pubblica testimonianze visibili
CREATE POLICY "Public can view visible testimonials" ON testimonials
    FOR SELECT USING (is_visible = true);

-- Policy per inserimento contatti (chiunque può inviare)
CREATE POLICY "Anyone can insert contacts" ON contacts
    FOR INSERT WITH CHECK (true);

-- Policy per inserimento ordini (chiunque può creare un ordine)
CREATE POLICY "Anyone can insert orders" ON orders
    FOR INSERT WITH CHECK (true);

-- Policy per admin (accesso completo)
CREATE POLICY "Admin full access packages" ON packages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Admin full access orders" ON orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Admin full access testimonials" ON testimonials
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Admin full access contacts" ON contacts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Admin full access admin_users" ON admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE email = auth.jwt() ->> 'email'
        )
    );

-- IMPORTANTE: Aggiungi il tuo email come admin per usare il pannello admin con autenticazione reale
-- INSERT INTO admin_users (email) VALUES ('tua@email.com');

-- I pacchetti e le testimonianze si creano dal pannello admin: http://localhost:5173/admin
