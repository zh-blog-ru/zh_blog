-- Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() at time zone 'utc'),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() at time zone 'utc'),
    locale VARCHAR(10) DEFAULT 'en' -- Языковая настройка пользователя (en, fr, es, и т.д.)
);

-- Таблица статей
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    img varchar(255) NOT NULL;
    theme varchar(16)[] NOT NULL;
    time_to_read int NOT NULL;
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() at time zone 'utc'),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() at time zone 'utc')
);
-- Таблица для перевода статей
CREATE TABLE article_translations (
    article_id INTEGER REFERENCES articles(id),
    locale char(2) not null check(char in array[ru,en]);
    title VARCHAR(255) NOT NULL,
    resume VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    PRIMARY KEY (article_id, locale) -- Составной ключ для уникальности перевода для каждой статьи
);

-- Таблица лайков
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    article_id INTEGER REFERENCES articles(id),
    is_like BOOLEAN NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() at time zone 'utc'),
    UNIQUE (user_id, article_id) -- Пользователь может поставить только один лайк статье
);

-- Таблица комментариев
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    article_id INTEGER REFERENCES articles(id),
    parent_comment_id INTEGER REFERENCES comments(id) NULL, -- Для древовидных комментариев
    text TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() at time zone 'utc'),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() at time zone 'utc')
);


CREATE OR REPLACE FUNCTION check_varchar_array_length()
RETURNS TRIGGER AS $$
BEGIN
    IF array_length(NEW.theme, 1) > 3 THEN
        RAISE EXCEPTION 'Array length exceeds maximum allowed length of 3';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER t_articles_lenght_theme_check
BEFORE INSERT OR UPDATE
ON articles
FOR EACH ROW
EXECUTE FUNCTION check_varchar_array_length();

CREATE TRIGGER t_comments_update_update_at
BEFORE UPDATE
ON articles
FOR EACH ROW
EXECUTE FUNCTION update_update_at();
