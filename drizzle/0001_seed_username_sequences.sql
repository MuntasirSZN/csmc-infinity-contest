-- Seed initial username sequences for categories P, J, S
INSERT INTO username_sequences (category, current_number) VALUES
  ("P", 0),
  ("J", 0),
  ("S", 0)
ON CONFLICT(category) DO NOTHING;