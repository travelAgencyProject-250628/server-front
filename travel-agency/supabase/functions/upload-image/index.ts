import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3@3.540.0"

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
    console.log('요청 시작')
    
    const formData = await req.formData()
    console.log('FormData 파싱 완료')
    
    const file = formData.get('file') as File
    const key = formData.get('key') as string
    const bucket = formData.get('bucket') as string
    
    console.log('파라미터 확인:', { 
      hasFile: !!file, 
      key, 
      bucket,
      fileSize: file?.size,
      fileName: file?.name
    })

    if (!file || !key || !bucket) {
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
    const publicDomain = Deno.env.get('R2_PUBLIC_DOMAIN') // 공개 도메인 추가
    
    console.log('환경 변수 확인:', { 
      hasEndpoint: !!endpoint, 
      hasAccessKey: !!accessKeyId, 
      hasSecretKey: !!secretAccessKey,
      hasPublicDomain: !!publicDomain
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

    // 파일을 ArrayBuffer로 변환
    const arrayBuffer = await file.arrayBuffer()
    console.log('파일 ArrayBuffer 변환 완료, 크기:', arrayBuffer.byteLength)

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

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: arrayBuffer,
      ContentType: file.type,
      ACL: 'public-read',
    })

    console.log('R2 업로드 시작:', { bucket, key, contentType: file.type })
    await r2Client.send(command)
    console.log('R2 업로드 완료')

    // R2 공개 URL 생성
    let publicUrl
    if (publicDomain) {
      // 커스텀 공개 도메인이 설정된 경우
      publicUrl = `${publicDomain}/${key}`
    } else {
      // 실제 R2 공개 개발 URL 사용
      // travel-products 버킷의 실제 공개 URL: https://pub-5d84e73636f44524b9cc63f124cda236.r2.dev
      publicUrl = `https://pub-5d84e73636f44524b9cc63f124cda236.r2.dev/${key}`
    }
    
    console.log('Bucket:', bucket)
    console.log('Key:', key)
    console.log('Endpoint:', endpoint)
    console.log('생성된 공개 URL:', publicUrl)

    return new Response(
      JSON.stringify({ 
        success: true, 
        url: publicUrl 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('R2 업로드 오류:', error)
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