CREATE TABLE test_results (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    score INTEGER DEFAULT 5,
    total_questions INTEGER DEFAULT 5
);

CREATE INDEX idx_completed_at ON test_results(completed_at DESC);