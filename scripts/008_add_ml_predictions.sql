-- Add ML predictions and enhanced data logging tables
CREATE TABLE IF NOT EXISTS ml_predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prediction_type VARCHAR(50) NOT NULL,
  risk_level VARCHAR(20) NOT NULL, -- low, medium, high, critical
  confidence_score DECIMAL(5,4) NOT NULL,
  prediction_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS data_exports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  export_type VARCHAR(50) NOT NULL,
  file_path TEXT NOT NULL,
  record_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE ml_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_exports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own predictions" ON ml_predictions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own predictions" ON ml_predictions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own exports" ON data_exports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exports" ON data_exports
  FOR INSERT WITH CHECK (auth.uid() = user_id);
