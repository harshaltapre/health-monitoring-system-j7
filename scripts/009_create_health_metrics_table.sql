-- Create health_metrics table for storing ECG and other health data
CREATE TABLE IF NOT EXISTS public.health_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    metric_type VARCHAR(50) NOT NULL, -- 'ecg', 'heart_rate', 'blood_pressure', etc.
    value NUMERIC NOT NULL,
    unit VARCHAR(20) NOT NULL, -- 'bpm', 'mmHg', 'mV', etc.
    device_id VARCHAR(100), -- ESP32 device identifier
    api_key_used VARCHAR(100), -- Which API key was used
    metadata JSONB DEFAULT '{}', -- Additional data like waveform points, timestamps
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_id ON public.health_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_type ON public.health_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_health_metrics_recorded_at ON public.health_metrics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_type_time ON public.health_metrics(user_id, metric_type, recorded_at);

-- Enable RLS
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own health metrics" ON public.health_metrics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health metrics" ON public.health_metrics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health metrics" ON public.health_metrics
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Caretakers can view patient health metrics" ON public.health_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.caretaker_patients cp
            WHERE cp.caretaker_id = auth.uid() 
            AND cp.patient_id = health_metrics.user_id
        )
    );
