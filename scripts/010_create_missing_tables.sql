-- Create health_metrics table for ECG and sensor data
CREATE TABLE IF NOT EXISTS public.health_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    metric_type VARCHAR(50) NOT NULL, -- 'heart_rate', 'ecg', 'temperature', etc.
    value NUMERIC NOT NULL,
    unit VARCHAR(20) DEFAULT 'mv' NOT NULL, -- 'bpm', 'celsius', 'mv', etc.
    device_id VARCHAR(100), -- ESP32 device identifier
    raw_data JSONB, -- Store raw sensor data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create api_keys table for ESP32 device management
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    key_name VARCHAR(100) NOT NULL, -- Updated column name to match settings page
    api_key VARCHAR(255) NOT NULL UNIQUE,
    device_type VARCHAR(50) DEFAULT 'esp32' NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_id ON public.health_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_type_time ON public.health_metrics(metric_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON public.api_keys(api_key) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for health_metrics
CREATE POLICY "Users can view their own health metrics" ON public.health_metrics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health metrics" ON public.health_metrics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health metrics" ON public.health_metrics
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health metrics" ON public.health_metrics
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for api_keys
CREATE POLICY "Users can view their own API keys" ON public.api_keys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own API keys" ON public.api_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys" ON public.api_keys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys" ON public.api_keys
    FOR DELETE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON public.health_metrics TO authenticated;
GRANT ALL ON public.api_keys TO authenticated;
