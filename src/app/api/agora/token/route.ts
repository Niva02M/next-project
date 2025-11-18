import { ChatTokenBuilder } from 'agora-token';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const appId = process.env.AGORA_APP_ID!;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE!;

    if (!appId || !appCertificate) {
      return NextResponse.json({ error: 'Agora credentials not configured' }, { status: 500 });
    }

    const expireTimeInSeconds = 3600;

    const token = ChatTokenBuilder.buildUserToken(appId, appCertificate, userId, expireTimeInSeconds);

    console.log('Token generated for user:', userId);

    return NextResponse.json({
      token,
      userId,
      expiresIn: expireTimeInSeconds
    });
  } catch (error: any) {
    console.error('Token generation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate token' }, { status: 500 });
  }
}
