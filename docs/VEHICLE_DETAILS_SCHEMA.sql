-- Extension to vehicles table: Add vehicle details
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS vehicle_name TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS vehicle_number TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS registration_number TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS owner_name TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS tracking_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create simulator_settings table
CREATE TABLE IF NOT EXISTS simulator_settings (
  setting_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  max_vehicles INTEGER NOT NULL DEFAULT 3 CHECK (max_vehicles >= 1 AND max_vehicles <= 6),
  overspeeding_limit INTEGER NOT NULL DEFAULT 60 CHECK (overspeeding_limit >= 40 AND overspeeding_limit <= 120),
  update_interval INTEGER NOT NULL DEFAULT 5000 CHECK (update_interval >= 1000 AND update_interval <= 10000),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(setting_id)
);

-- Insert default simulator settings
INSERT INTO simulator_settings (max_vehicles, overspeeding_limit, update_interval)
VALUES (3, 60, 5000)
ON CONFLICT DO NOTHING;

-- Create vehicle_events table for detailed history
CREATE TABLE IF NOT EXISTS vehicle_events (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id TEXT NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('overspeeding', 'accident', 'route_change', 'status_change', 'location_update')),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  speed INTEGER,
  previous_value TEXT,
  new_value TEXT,
  description TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vehicle_events_vehicle_id ON vehicle_events(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_events_timestamp ON vehicle_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_vehicle_events_type ON vehicle_events(event_type);
CREATE INDEX IF NOT EXISTS idx_vehicles_number ON vehicles(vehicle_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_registration ON vehicles(registration_number);

-- Enable Row Level Security
ALTER TABLE simulator_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_events ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth setup)
CREATE POLICY "Allow all operations for authenticated users" ON simulator_settings
  FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON vehicle_events
  FOR ALL USING (true);

