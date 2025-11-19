import { NextResponse } from 'next/server';
import axios from 'axios';

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function POST(req: Request) {
  try {
    const { userId, nickname, avatarurl } = await req.json();
    if (!userId)
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 },
      );

    const appKey = process.env.NEXT_PUBLIC_AGORA_APP_KEY_1!;
    const [orgName, appName] = appKey.split('#');
    const region = 'a61';

    const auth = Buffer.from(
      `${process.env.AGORA_CUSTOMER_KEY}:${process.env.AGORA_CUSTOMER_SECRET}`,
    ).toString('base64');

    const url = `https://${region}.chat.agora.io/${orgName}/${appName}/users`;

    const response = await axios.post(
      url,
      { username: userId, password: 'defaultpass', nickname, avatarurl },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    const msg = error.response?.data || error.message;
    console.error('Agora create-user failed:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
