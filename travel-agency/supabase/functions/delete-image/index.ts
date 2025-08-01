import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { S3Client, DeleteObjectCommand } from "npm:@aws-sdk/client-s3@3.540.0"

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
    console.log('삭제 요청 시작')
    
    const { key, bucket } = await req.json()
    
    console.log('파라미터 확인:', { key, bucket })

    if (!key || !bucket) {
      return new Response(
        JSON.stringify({ success: false, error: '필수 파라미터가 누락되었습니다.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // 환경 변수 확인
    const endpoint = Deno.env.get('R2_ENDPOINT')
    const accessKeyId = Deno.env.get('R2_ACCESS_KEY_ID')
    const secretAccessKey = Deno.env.get('R2_SECRET_ACCESS_KEY')
    
    console.log('환경 변수 확인:', { 
      hasEndpoint: !!endpoint, 
      hasAccessKey: !!accessKeyId, 
      hasSecretKey: !!secretAccessKey
    })

    if (!endpoint || !accessKeyId || !secretAccessKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'R2 환경 변수가 설정되지 않았습니다.' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // R2 클라이언트 설정
    const r2Client = new S3Client({
      region: 'auto',
      endpoint: endpoint,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    })

    console.log('R2 클라이언트 생성 완료')

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })

    console.log('R2 삭제 시작:', { bucket, key })
    await r2Client.send(command)
    console.log('R2 삭제 완료')

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
        error: error.message,
        stack: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 