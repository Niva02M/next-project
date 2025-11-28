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
      return NextResponse.json(
        { error: 'Agora credentials not configured' },
        { status: 500 },
      );
    }

    // Use 0 for uid to allow any user to join with string userId
    const uid = 0;
    const role = RtcRole.PUBLISHER;
    const expireTimeInSeconds = 3600;
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpire = currentTime + expireTimeInSeconds;

    const rtcToken = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channel,
      uid,
      role,
      expireTimeInSeconds,
      privilegeExpire,
    );

    return NextResponse.json({
      rtcToken,
      userId,
      channel,
      appId,
      expiresIn: expireTimeInSeconds,
    });
  } catch (error: any) {
    console.error('RTC Token generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate RTC token' },
      { status: 500 },
    );
  }
}
