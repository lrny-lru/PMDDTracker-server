CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TABLE IF EXISTS symptoms;

CREATE TABLE symptoms(
    id uuid DEFAULT uuid_generate_v4 (),
    date TIMESTAMPTZ DEFAULT now() NOT NULL,
    name TEXT NOT NULL,
    severity INTEGER NOT NULL,
    description TEXT,
    PRIMARY KEY (id)
);