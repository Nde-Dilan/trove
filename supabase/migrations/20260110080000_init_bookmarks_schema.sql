-- Migration: 20260110080000_init_bookmarks_schema.sql
-- Description: Create initial schema for Trove and seeding default data

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Collections Table
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tags Table
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Bookmarks Table
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    collection_id UUID REFERENCES public.collections ON DELETE SET NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    favicon_url TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    has_dark_icon BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'trash')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Bookmark Tags (Join Table)
CREATE TABLE IF NOT EXISTS public.bookmark_tags (
    bookmark_id UUID REFERENCES public.bookmarks ON DELETE CASCADE NOT NULL,
    tag_id UUID REFERENCES public.tags ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (bookmark_id, tag_id)
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmark_tags ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can manage their own collections" ON public.collections FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own tags" ON public.tags FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own bookmark tags" ON public.bookmark_tags 
FOR ALL USING (EXISTS (SELECT 1 FROM public.bookmarks WHERE id = bookmark_tags.bookmark_id AND user_id = auth.uid()));

-- 8. Auto-create Profile + Default Data on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    full_name TEXT;
    f_name TEXT;
    l_name TEXT;
BEGIN
    -- Get full name from metadata
    full_name := NEW.raw_user_meta_data->>'full_name';
    
    -- Split name logic: "Jean Dupont" -> first_name: "Jean", last_name: "Dupont"
    IF full_name IS NOT NULL THEN
        f_name := split_part(full_name, ' ', 1);
        l_name := substring(full_name from position(' ' in full_name) + 1);
        -- Handle case where there's only one name
        IF l_name = f_name THEN l_name := ''; END IF;
    ELSE
        f_name := NEW.raw_user_meta_data->>'first_name';
        l_name := NEW.raw_user_meta_data->>'last_name';
    END IF;

    -- Create Profile
    INSERT INTO public.profiles (id, email, first_name, last_name, avatar_url)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(f_name, ''), 
        COALESCE(l_name, ''), 
        NEW.raw_user_meta_data->>'avatar_url'
    );

    -- Seed Default Collections from mock-data
    INSERT INTO public.collections (user_id, name, icon, color) VALUES
    (NEW.id, 'Design Resources', 'palette', 'violet'),
    (NEW.id, 'Development', 'code', 'blue'),
    (NEW.id, 'Tools', 'wrench', 'amber'),
    (NEW.id, 'Reading List', 'book-open', 'emerald'),
    (NEW.id, 'Inspiration', 'sparkles', 'pink');

    -- Seed Default Tags from mock-data
    INSERT INTO public.tags (user_id, name, color) VALUES
    (NEW.id, 'React', 'bg-blue-500/10 text-blue-500'),
    (NEW.id, 'TypeScript', 'bg-blue-600/10 text-blue-600'),
    (NEW.id, 'UI/UX', 'bg-violet-500/10 text-violet-500'),
    (NEW.id, 'Next.js', 'bg-foreground/10 text-foreground'),
    (NEW.id, 'Tailwind', 'bg-cyan-500/10 text-cyan-500'),
    (NEW.id, 'Tutorial', 'bg-emerald-500/10 text-emerald-500'),
    (NEW.id, 'Documentation', 'bg-amber-500/10 text-amber-500'),
    (NEW.id, 'Free', 'bg-green-500/10 text-green-500');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 9. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_status ON public.bookmarks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_bookmarks_is_favorite ON public.bookmarks(user_id) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_bookmarks_collection ON public.bookmarks(collection_id);
CREATE INDEX IF NOT EXISTS idx_bookmark_tags_tag ON public.bookmark_tags(tag_id);
