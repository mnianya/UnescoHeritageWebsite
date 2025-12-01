--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-12-01 12:59:04

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 238 (class 1255 OID 16666)
-- Name: deleteuserandrelateddata(integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.deleteuserandrelateddata(IN user_identifier integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Удаляем отзывы пользователя
    DELETE FROM Review
    WHERE user_id = user_identifier;

    -- Удаляем избранное пользователя
    DELETE FROM Favorite
    WHERE user_id = user_identifier;

    -- Удаляем пользователя
    DELETE FROM "User"
    WHERE user_id = user_identifier;

    RAISE NOTICE 'User and all related data have been successfully deleted.';
END;
$$;


ALTER PROCEDURE public.deleteuserandrelateddata(IN user_identifier integer) OWNER TO postgres;

--
-- TOC entry 236 (class 1255 OID 16663)
-- Name: getaveragerating(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.getaveragerating(monument_identifier integer) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
DECLARE
    total_sum NUMERIC;
    total_count INTEGER;
    calculated_average NUMERIC;
BEGIN
    SELECT 
        SUM(rating), COUNT(review_id)
    INTO 
        total_sum, total_count
    FROM 
        Review
    WHERE 
        monument_id = monument_identifier;

    IF total_count IS NULL OR total_count = 0 THEN
        RETURN 0;
    END IF;

    calculated_average := total_sum / total_count;
    RETURN ROUND(calculated_average, 2);
END;
$$;


ALTER FUNCTION public.getaveragerating(monument_identifier integer) OWNER TO postgres;

--
-- TOC entry 237 (class 1255 OID 16664)
-- Name: setreviewpublishdate(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.setreviewpublishdate() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.publish_date IS NULL THEN
        NEW.publish_date := CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.setreviewpublishdate() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16476)
-- Name: country; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.country (
    country_id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.country OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16475)
-- Name: country_country_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.country_country_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.country_country_id_seq OWNER TO postgres;

--
-- TOC entry 4944 (class 0 OID 0)
-- Dependencies: 217
-- Name: country_country_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.country_country_id_seq OWNED BY public.country.country_id;


--
-- TOC entry 232 (class 1259 OID 16599)
-- Name: dailycollection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dailycollection (
    collection_id integer NOT NULL,
    date date NOT NULL
);


ALTER TABLE public.dailycollection OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16598)
-- Name: dailycollection_collection_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dailycollection_collection_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dailycollection_collection_id_seq OWNER TO postgres;

--
-- TOC entry 4945 (class 0 OID 0)
-- Dependencies: 231
-- Name: dailycollection_collection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dailycollection_collection_id_seq OWNED BY public.dailycollection.collection_id;


--
-- TOC entry 234 (class 1259 OID 16608)
-- Name: dailymonument; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dailymonument (
    daily_monument_id integer NOT NULL,
    monument_id integer NOT NULL,
    collection_id integer NOT NULL
);


ALTER TABLE public.dailymonument OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16607)
-- Name: dailymonument_daily_monument_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dailymonument_daily_monument_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dailymonument_daily_monument_id_seq OWNER TO postgres;

--
-- TOC entry 4946 (class 0 OID 0)
-- Dependencies: 233
-- Name: dailymonument_daily_monument_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dailymonument_daily_monument_id_seq OWNED BY public.dailymonument.daily_monument_id;


--
-- TOC entry 230 (class 1259 OID 16580)
-- Name: favorite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorite (
    favorite_id integer NOT NULL,
    user_id integer NOT NULL,
    monument_id integer NOT NULL
);


ALTER TABLE public.favorite OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16579)
-- Name: favorite_favorite_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favorite_favorite_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favorite_favorite_id_seq OWNER TO postgres;

--
-- TOC entry 4947 (class 0 OID 0)
-- Dependencies: 229
-- Name: favorite_favorite_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favorite_favorite_id_seq OWNED BY public.favorite.favorite_id;


--
-- TOC entry 222 (class 1259 OID 16494)
-- Name: monument; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.monument (
    monument_id integer NOT NULL,
    country_id integer NOT NULL,
    category_id integer NOT NULL,
    city character varying(255),
    short_description text,
    history text,
    visit_recommendations text,
    unesco_link character varying(500),
    name character varying(255) NOT NULL
);


ALTER TABLE public.monument OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16493)
-- Name: monument_monument_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.monument_monument_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.monument_monument_id_seq OWNER TO postgres;

--
-- TOC entry 4948 (class 0 OID 0)
-- Dependencies: 221
-- Name: monument_monument_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.monument_monument_id_seq OWNED BY public.monument.monument_id;


--
-- TOC entry 220 (class 1259 OID 16485)
-- Name: monumentcategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.monumentcategory (
    category_id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.monumentcategory OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16484)
-- Name: monumentcategory_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.monumentcategory_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.monumentcategory_category_id_seq OWNER TO postgres;

--
-- TOC entry 4949 (class 0 OID 0)
-- Dependencies: 219
-- Name: monumentcategory_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.monumentcategory_category_id_seq OWNED BY public.monumentcategory.category_id;


--
-- TOC entry 228 (class 1259 OID 16559)
-- Name: review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review (
    review_id integer NOT NULL,
    user_id integer NOT NULL,
    monument_id integer NOT NULL,
    comment text,
    rating integer,
    photo_url text,
    publish_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT review_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.review OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16658)
-- Name: monumentfullinfo; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.monumentfullinfo AS
 SELECT m.monument_id,
    m.city,
    c.name AS country_name,
    mc.name AS category_name,
    m.short_description,
    round(avg(r.rating), 2) AS average_rating,
    count(r.review_id) AS review_count
   FROM (((public.monument m
     JOIN public.country c ON ((m.country_id = c.country_id)))
     JOIN public.monumentcategory mc ON ((m.category_id = mc.category_id)))
     LEFT JOIN public.review r ON ((m.monument_id = r.monument_id)))
  GROUP BY m.monument_id, m.city, c.name, mc.name, m.short_description;


ALTER VIEW public.monumentfullinfo OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16513)
-- Name: photo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.photo (
    photo_id integer NOT NULL,
    monument_id integer NOT NULL,
    photo_url text NOT NULL
);


ALTER TABLE public.photo OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16512)
-- Name: photo_photo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.photo_photo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.photo_photo_id_seq OWNER TO postgres;

--
-- TOC entry 4950 (class 0 OID 0)
-- Dependencies: 223
-- Name: photo_photo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.photo_photo_id_seq OWNED BY public.photo.photo_id;


--
-- TOC entry 227 (class 1259 OID 16558)
-- Name: review_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.review_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.review_review_id_seq OWNER TO postgres;

--
-- TOC entry 4951 (class 0 OID 0)
-- Dependencies: 227
-- Name: review_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.review_review_id_seq OWNED BY public.review.review_id;


--
-- TOC entry 226 (class 1259 OID 16540)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    login character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    photo_url text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16539)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 4952 (class 0 OID 0)
-- Dependencies: 225
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4742 (class 2604 OID 16479)
-- Name: country country_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country ALTER COLUMN country_id SET DEFAULT nextval('public.country_country_id_seq'::regclass);


--
-- TOC entry 4750 (class 2604 OID 16602)
-- Name: dailycollection collection_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dailycollection ALTER COLUMN collection_id SET DEFAULT nextval('public.dailycollection_collection_id_seq'::regclass);


--
-- TOC entry 4751 (class 2604 OID 16611)
-- Name: dailymonument daily_monument_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dailymonument ALTER COLUMN daily_monument_id SET DEFAULT nextval('public.dailymonument_daily_monument_id_seq'::regclass);


--
-- TOC entry 4749 (class 2604 OID 16583)
-- Name: favorite favorite_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite ALTER COLUMN favorite_id SET DEFAULT nextval('public.favorite_favorite_id_seq'::regclass);


--
-- TOC entry 4744 (class 2604 OID 16497)
-- Name: monument monument_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monument ALTER COLUMN monument_id SET DEFAULT nextval('public.monument_monument_id_seq'::regclass);


--
-- TOC entry 4743 (class 2604 OID 16488)
-- Name: monumentcategory category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monumentcategory ALTER COLUMN category_id SET DEFAULT nextval('public.monumentcategory_category_id_seq'::regclass);


--
-- TOC entry 4745 (class 2604 OID 16516)
-- Name: photo photo_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.photo ALTER COLUMN photo_id SET DEFAULT nextval('public.photo_photo_id_seq'::regclass);


--
-- TOC entry 4747 (class 2604 OID 16562)
-- Name: review review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review ALTER COLUMN review_id SET DEFAULT nextval('public.review_review_id_seq'::regclass);


--
-- TOC entry 4746 (class 2604 OID 16543)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 4754 (class 2606 OID 16483)
-- Name: country country_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country
    ADD CONSTRAINT country_name_key UNIQUE (name);


--
-- TOC entry 4756 (class 2606 OID 16481)
-- Name: country country_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country
    ADD CONSTRAINT country_pkey PRIMARY KEY (country_id);


--
-- TOC entry 4778 (class 2606 OID 16606)
-- Name: dailycollection dailycollection_date_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dailycollection
    ADD CONSTRAINT dailycollection_date_key UNIQUE (date);


--
-- TOC entry 4780 (class 2606 OID 16604)
-- Name: dailycollection dailycollection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dailycollection
    ADD CONSTRAINT dailycollection_pkey PRIMARY KEY (collection_id);


--
-- TOC entry 4782 (class 2606 OID 16613)
-- Name: dailymonument dailymonument_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dailymonument
    ADD CONSTRAINT dailymonument_pkey PRIMARY KEY (daily_monument_id);


--
-- TOC entry 4774 (class 2606 OID 16585)
-- Name: favorite favorite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite
    ADD CONSTRAINT favorite_pkey PRIMARY KEY (favorite_id);


--
-- TOC entry 4762 (class 2606 OID 16501)
-- Name: monument monument_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monument
    ADD CONSTRAINT monument_pkey PRIMARY KEY (monument_id);


--
-- TOC entry 4758 (class 2606 OID 16492)
-- Name: monumentcategory monumentcategory_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monumentcategory
    ADD CONSTRAINT monumentcategory_name_key UNIQUE (name);


--
-- TOC entry 4760 (class 2606 OID 16490)
-- Name: monumentcategory monumentcategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monumentcategory
    ADD CONSTRAINT monumentcategory_pkey PRIMARY KEY (category_id);


--
-- TOC entry 4764 (class 2606 OID 16520)
-- Name: photo photo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.photo
    ADD CONSTRAINT photo_pkey PRIMARY KEY (photo_id);


--
-- TOC entry 4772 (class 2606 OID 16568)
-- Name: review review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (review_id);


--
-- TOC entry 4776 (class 2606 OID 16587)
-- Name: favorite uq_favorite; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite
    ADD CONSTRAINT uq_favorite UNIQUE (user_id, monument_id);


--
-- TOC entry 4766 (class 2606 OID 16551)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4768 (class 2606 OID 16549)
-- Name: users users_login_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_login_key UNIQUE (login);


--
-- TOC entry 4770 (class 2606 OID 16547)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4792 (class 2620 OID 16665)
-- Name: review triggersetreviewpublishdate; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER triggersetreviewpublishdate BEFORE INSERT ON public.review FOR EACH ROW EXECUTE FUNCTION public.setreviewpublishdate();


--
-- TOC entry 4790 (class 2606 OID 16619)
-- Name: dailymonument fk_daily_collection; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dailymonument
    ADD CONSTRAINT fk_daily_collection FOREIGN KEY (collection_id) REFERENCES public.dailycollection(collection_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4791 (class 2606 OID 16614)
-- Name: dailymonument fk_daily_monument; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dailymonument
    ADD CONSTRAINT fk_daily_monument FOREIGN KEY (monument_id) REFERENCES public.monument(monument_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4788 (class 2606 OID 16593)
-- Name: favorite fk_favorite_monument; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite
    ADD CONSTRAINT fk_favorite_monument FOREIGN KEY (monument_id) REFERENCES public.monument(monument_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4789 (class 2606 OID 16588)
-- Name: favorite fk_favorite_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite
    ADD CONSTRAINT fk_favorite_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4783 (class 2606 OID 16507)
-- Name: monument fk_monument_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monument
    ADD CONSTRAINT fk_monument_category FOREIGN KEY (category_id) REFERENCES public.monumentcategory(category_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4784 (class 2606 OID 16502)
-- Name: monument fk_monument_country; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monument
    ADD CONSTRAINT fk_monument_country FOREIGN KEY (country_id) REFERENCES public.country(country_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4785 (class 2606 OID 16521)
-- Name: photo fk_photo_monument; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.photo
    ADD CONSTRAINT fk_photo_monument FOREIGN KEY (monument_id) REFERENCES public.monument(monument_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4786 (class 2606 OID 16574)
-- Name: review fk_review_monument; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT fk_review_monument FOREIGN KEY (monument_id) REFERENCES public.monument(monument_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4787 (class 2606 OID 16569)
-- Name: review fk_review_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2025-12-01 12:59:05

--
-- PostgreSQL database dump complete
--

