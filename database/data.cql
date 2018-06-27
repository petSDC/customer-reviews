DROP KEYSPACE IF EXISTS shop_reviews;

CREATE KEYSPACE shop_reviews
	WITH REPLICATION = {
		'class': 'SimpleStrategy',
		'replication_factor': 1
	};

USE shop_reviews;

CREATE TABLE shop_reviews.reviews (
	id UUID,
	username VARCHAR,
	user_avatar VARCHAR,
	product_id INT,
	shop_id INT,
	date_submitted DATE,
	rating INT,
	review TEXT,
	helpfulness INT,
	PRIMARY KEY (id, product_id))
WITH CLUSTERING ORDER BY (product_id DESC);

CREATE INDEX IF NOT EXISTS product_id ON shop_reviews.reviews (product_id);
CREATE INDEX IF NOT EXISTS shop_id ON shop_reviews.reviews (shop_id);
