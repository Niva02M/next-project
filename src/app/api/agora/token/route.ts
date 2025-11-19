import { ChatTokenBuilder } from 'agora-token';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId)
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400, headers: corsHeaders },
      );

    const appId = process.env.AGORA_APP_ID!;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE!;
    if (!appId || !appCertificate)
      return NextResponse.json(
        { error: 'Agora credentials not configured' },
        { status: 500, headers: corsHeaders },
      );

    const expireTimeInSeconds = 3600;
    const token = ChatTokenBuilder.buildUserToken(
      appId,
      appCertificate,
      userId,
      expireTimeInSeconds,
    );

    console.log('Token generated for user:', userId);

    return NextResponse.json(
      { token, userId, expiresIn: expireTimeInSeconds },
      { headers: corsHeaders },
    );
  } catch (error: any) {
    console.error('Token generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate token' },
      { status: 500, headers: corsHeaders },
    );
  }
}
