// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = ''

const handler = async (req: Request): Promise<Response> => {
  // CORS 헤더 설정
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, content } = await req.json()
    
    console.log('이메일 전송 요청:', { to, subject, content })
    
    // 입력 검증
    if (!to || !subject || !content) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: '필수 필드가 누락되었습니다: to, subject, content' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    // Resend API를 통한 이메일 전송
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY가 설정되지 않았습니다.')
    }
    
    try {
      console.log('Resend API로 이메일 전송 시작...')
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: to,
          subject: subject,
          html: content,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Resend API 오류: ${response.status} - ${JSON.stringify(errorData)}`)
      }
      
      const data = await response.json()
      console.log('이메일 전송 성공:', data)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: '이메일 전송 성공',
          data: data
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
      
    } catch (apiError) {
      console.error('Resend API 오류:', apiError)
      throw new Error(`이메일 전송 실패: ${apiError.message}`)
    }
    
  } catch (error) {
    console.error('이메일 전송 오류:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
}

serve(handler)

