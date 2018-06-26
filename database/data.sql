DROP SCHEMA IF EXISTS shop_reviews CASCADE;

CREATE SCHEMA shop_reviews
	CREATE TABLE users (
		id SERIAL PRIMARY KEY,
		username VARCHAR(50),
		avatar_url VARCHAR(100)
	)
	CREATE TABLE shops (
		id SERIAL PRIMARY KEY,
		shop VARCHAR(50)
	)
	CREATE TABLE products (
		id SERIAL PRIMARY KEY,
		product VARCHAR(50),
		img_url VARCHAR(100),
		shop_id integer
	)
	CREATE TABLE reviews (
		id SERIAL PRIMARY KEY,
		user_id integer,
		product_id integer,
		date_submitted date,
		rating integer,
		review text,
		helpfulness integer,
		shop_id integer
	);
