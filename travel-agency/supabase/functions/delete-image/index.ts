import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { S3Client, DeleteObjectCommand } from "https://esm.sh/@aws-sdk/client-s3@3.540.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS preflight 요청 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { key, bucket } = await req.json()

    if (!key || !bucket) {
      return new Response(
        JSON.stringify({ success: false, error: '필수 파라미터가 누락되었습니다.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // R2 클라이언트 설정
    const r2Client = new S3Client({
      region: 'auto',
      endpoint: Deno.env.get('R2_ENDPOINT'),
      credentials: {
        accessKeyId: Deno.env.get('R2_ACCESS_KEY_ID') || '',
        secretAccessKey: Deno.env.get('R2_SECRET_ACCESS_KEY') || '',
      },
    })

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })

    await r2Client.send(command)

    return new Response(
      JSON.stringify({ 
        success: true 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('R2 삭제 오류:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 