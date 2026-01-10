-- Migration: 20260110110000_seed_bookmarks_trigger.sql
-- Description: Update handle_new_user function to seed default bookmarks

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    full_name TEXT;
    f_name TEXT;
    l_name TEXT;
    
    v_col_design UUID;
    v_col_dev UUID;
    v_col_tools UUID;
    v_col_reading UUID;
    v_col_inspiration UUID;
    
    v_tag_react UUID;
    v_tag_ts UUID;
    v_tag_ui UUID;
    v_tag_next UUID;
    v_tag_tailwind UUID;
    v_tag_tutorial UUID;
    v_tag_docs UUID;
    v_tag_free UUID;

    v_bookmark_id UUID;
BEGIN
    -- Get full name from metadata
    full_name := NEW.raw_user_meta_data->>'full_name';
    
    -- Split name logic
    IF full_name IS NOT NULL THEN
        f_name := split_part(full_name, ' ', 1);
        l_name := substring(full_name from position(' ' in full_name) + 1);
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

    -- Seed Default Collections and capture IDs
    INSERT INTO public.collections (user_id, name, icon, color) VALUES (NEW.id, 'Design Resources', 'palette', 'violet') RETURNING id INTO v_col_design;
    INSERT INTO public.collections (user_id, name, icon, color) VALUES (NEW.id, 'Development', 'code', 'blue') RETURNING id INTO v_col_dev;
    INSERT INTO public.collections (user_id, name, icon, color) VALUES (NEW.id, 'Tools', 'wrench', 'amber') RETURNING id INTO v_col_tools;
    INSERT INTO public.collections (user_id, name, icon, color) VALUES (NEW.id, 'Reading List', 'book-open', 'emerald') RETURNING id INTO v_col_reading;
    INSERT INTO public.collections (user_id, name, icon, color) VALUES (NEW.id, 'Inspiration', 'sparkles', 'pink') RETURNING id INTO v_col_inspiration;

    -- Seed Default Tags and capture IDs
    INSERT INTO public.tags (user_id, name, color) VALUES (NEW.id, 'React', 'bg-blue-500/10 text-blue-500') RETURNING id INTO v_tag_react;
    INSERT INTO public.tags (user_id, name, color) VALUES (NEW.id, 'TypeScript', 'bg-blue-600/10 text-blue-600') RETURNING id INTO v_tag_ts;
    INSERT INTO public.tags (user_id, name, color) VALUES (NEW.id, 'UI/UX', 'bg-violet-500/10 text-violet-500') RETURNING id INTO v_tag_ui;
    INSERT INTO public.tags (user_id, name, color) VALUES (NEW.id, 'Next.js', 'bg-foreground/10 text-foreground') RETURNING id INTO v_tag_next;
    INSERT INTO public.tags (user_id, name, color) VALUES (NEW.id, 'Tailwind', 'bg-cyan-500/10 text-cyan-500') RETURNING id INTO v_tag_tailwind;
    INSERT INTO public.tags (user_id, name, color) VALUES (NEW.id, 'Tutorial', 'bg-emerald-500/10 text-emerald-500') RETURNING id INTO v_tag_tutorial;
    INSERT INTO public.tags (user_id, name, color) VALUES (NEW.id, 'Documentation', 'bg-amber-500/10 text-amber-500') RETURNING id INTO v_tag_docs;
    INSERT INTO public.tags (user_id, name, color) VALUES (NEW.id, 'Free', 'bg-green-500/10 text-green-500') RETURNING id INTO v_tag_free;

    -- Seed Default Bookmarks
    -- 1. Shadcn UI
    INSERT INTO public.bookmarks (user_id, collection_id, title, url, description, favicon_url, is_favorite, has_dark_icon)
    VALUES (NEW.id, v_col_dev, 'Shadcn UI', 'https://ui.shadcn.com', 'Beautifully designed components built with Radix UI and Tailwind CSS.', 'https://www.google.com/s2/favicons?domain=ui.shadcn.com&sz=64', true, true)
    RETURNING id INTO v_bookmark_id;
    INSERT INTO public.bookmark_tags (bookmark_id, tag_id) VALUES (v_bookmark_id, v_tag_react), (v_bookmark_id, v_tag_ui), (v_bookmark_id, v_tag_tailwind);

    -- 2. Vercel
    INSERT INTO public.bookmarks (user_id, collection_id, title, url, description, favicon_url, is_favorite, has_dark_icon)
    VALUES (NEW.id, v_col_dev, 'Vercel', 'https://vercel.com', 'Develop. Preview. Ship. The best frontend developer experience.', 'https://www.google.com/s2/favicons?domain=vercel.com&sz=64', true, true)
    RETURNING id INTO v_bookmark_id;
    INSERT INTO public.bookmark_tags (bookmark_id, tag_id) VALUES (v_bookmark_id, v_tag_next);

    -- 3. Tailwind CSS
    INSERT INTO public.bookmarks (user_id, collection_id, title, url, description, favicon_url, is_favorite, has_dark_icon)
    VALUES (NEW.id, v_col_dev, 'Tailwind CSS', 'https://tailwindcss.com', 'A utility-first CSS framework for rapid UI development.', 'https://www.google.com/s2/favicons?domain=tailwindcss.com&sz=64', false, false)
    RETURNING id INTO v_bookmark_id;
    INSERT INTO public.bookmark_tags (bookmark_id, tag_id) VALUES (v_bookmark_id, v_tag_tailwind), (v_bookmark_id, v_tag_docs);

    -- 4. Figma
    INSERT INTO public.bookmarks (user_id, collection_id, title, url, description, favicon_url, is_favorite, has_dark_icon)
    VALUES (NEW.id, v_col_design, 'Figma', 'https://figma.com', 'The collaborative interface design tool.', 'https://www.google.com/s2/favicons?domain=figma.com&sz=64', true, false)
    RETURNING id INTO v_bookmark_id;
    INSERT INTO public.bookmark_tags (bookmark_id, tag_id) VALUES (v_bookmark_id, v_tag_ui), (v_bookmark_id, v_tag_free);

    -- 5. Dribbble
    INSERT INTO public.bookmarks (user_id, collection_id, title, url, description, favicon_url, is_favorite, has_dark_icon)
    VALUES (NEW.id, v_col_inspiration, 'Dribbble', 'https://dribbble.com', 'Discover the world''s top designers & creatives.', 'https://www.google.com/s2/favicons?domain=dribbble.com&sz=64', false, false)
    RETURNING id INTO v_bookmark_id;
    INSERT INTO public.bookmark_tags (bookmark_id, tag_id) VALUES (v_bookmark_id, v_tag_ui);

    -- 6. Radix UI
    INSERT INTO public.bookmarks (user_id, collection_id, title, url, description, favicon_url, is_favorite, has_dark_icon)
    VALUES (NEW.id, v_col_dev, 'Radix UI', 'https://radix-ui.com', 'Unstyled, accessible components for building design systems.', 'https://www.google.com/s2/favicons?domain=radix-ui.com&sz=64', false, true)
    RETURNING id INTO v_bookmark_id;
    INSERT INTO public.bookmark_tags (bookmark_id, tag_id) VALUES (v_bookmark_id, v_tag_react), (v_bookmark_id, v_tag_ui);

    -- 7. Linear
    INSERT INTO public.bookmarks (user_id, collection_id, title, url, description, favicon_url, is_favorite, has_dark_icon)
    VALUES (NEW.id, v_col_tools, 'Linear', 'https://linear.app', 'The issue tracking tool you''ll enjoy using.', 'https://www.google.com/s2/favicons?domain=linear.app&sz=64', true, false);

    -- 8. Framer
    INSERT INTO public.bookmarks (user_id, collection_id, title, url, description, favicon_url, is_favorite, has_dark_icon)
    VALUES (NEW.id, v_col_design, 'Framer', 'https://framer.com', 'Ship sites with unmatched speed and style.', 'https://www.google.com/s2/favicons?domain=framer.com&sz=64', true, true)
    RETURNING id INTO v_bookmark_id;
    INSERT INTO public.bookmark_tags (bookmark_id, tag_id) VALUES (v_bookmark_id, v_tag_ui);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
