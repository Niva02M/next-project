import { NextResponse } from 'next/server';
import { RtcTokenBuilder, RtcRole } from 'agora-token';
import type { NextRequest } from 'next/server';

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, channel } = body;

    if (!userId || !channel) {
      return NextResponse.json(
        { error: 'userId and channel are required' },
        { status: 400 },
      );
    }

    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appId || !appCertificate) {
      console.error('Missing Agora credentials');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 },
      );
    }

    const uid = userId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);

    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const rtcToken = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channel,
      uid,
      role,
      expirationTimeInSeconds,
      privilegeExpiredTs,
    );
    console.log('✅ Generated RTC token for:', { userId, uid, channel });

    return NextResponse.json({
      rtcToken,
      userId,
      channel,
      appId,
      expiresIn: expirationTimeInSeconds,
    });
  } catch (error: any) {
    console.error('RTC Token generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate RTC token' },
      { status: 500 },
    );
  }
}
