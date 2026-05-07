import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, prompt, predictionId } = await req.json();

    const apiKey = Deno.env.get('ONSPACE_AI_API_KEY');
    const baseUrl = Deno.env.get('ONSPACE_AI_BASE_URL');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // CREATE: start a new video prediction
    if (action === 'create') {
      if (!prompt?.trim()) {
        return new Response(
          JSON.stringify({ error: 'Prompt is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Creating video prediction for:', prompt.substring(0, 50));

      const response = await fetch(`${baseUrl}/models/openai/sora-2/predictions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          input: {
            prompt,
            seconds: 5,
            aspect_ratio: 'landscape',
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('OnSpace AI create error:', errText);
        return new Response(
          JSON.stringify({ error: `Video task creation failed: ${errText}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const prediction = await response.json();
      console.log('Prediction created:', prediction.id);

      return new Response(
        JSON.stringify({ id: prediction.id, status: 'starting' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // CHECK: poll status of an existing prediction
    if (action === 'check') {
      if (!predictionId) {
        return new Response(
          JSON.stringify({ error: 'predictionId is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const response = await fetch(`${baseUrl}/predictions/${predictionId}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });

      if (!response.ok) {
        const errText = await response.text();
        return new Response(
          JSON.stringify({ error: `Status check failed: ${errText}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const status = await response.json();
      console.log('Prediction status:', status.status, 'progress:', status.progress);

      if (status.status === 'failed' || status.status === 'canceled') {
        return new Response(
          JSON.stringify({ error: status.error ?? 'Video generation failed' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (status.status === 'starting' || status.status === 'processing') {
        return new Response(
          JSON.stringify({ id: predictionId, status: status.status, progress: status.progress ?? 0 }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (status.status === 'succeeded') {
        const videoUrl = status.output;
        console.log('Video succeeded, downloading from:', videoUrl);

        const videoRes = await fetch(videoUrl);
        const arrayBuffer = await videoRes.arrayBuffer();
        const videoBlob = new Blob([arrayBuffer], { type: 'video/mp4' });

        const fileName = `${predictionId}.mp4`;

        const { error: uploadError } = await supabase.storage
          .from('videos')
          .upload(fileName, videoBlob, {
            contentType: 'video/mp4',
            upsert: true,
          });

        if (uploadError) {
          console.error('Video upload error:', uploadError);
          return new Response(
            JSON.stringify({ error: `Storage upload failed: ${uploadError.message}` }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: { publicUrl } } = supabase.storage
          .from('videos')
          .getPublicUrl(fileName);

        console.log('Video stored at:', publicUrl);

        return new Response(
          JSON.stringify({ id: predictionId, status: 'succeeded', storage_url: publicUrl }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ id: predictionId, status: status.status }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use "create" or "check".' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: `Unexpected error: ${err.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
