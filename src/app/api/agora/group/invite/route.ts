import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from 'server';

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const region = 'a61';
    const { groupId, members } = await req.json();

    if (!groupId || !members || members.length === 0) {
      return NextResponse.json(
        { error: 'Group ID and members are required' },
        { status: 400 },
      );
    }
    const auth = Buffer.from(
      `${process.env.AGORA_CUSTOMER_KEY}:${process.env.AGORA_CUSTOMER_SECRET}`,
    ).toString('base64');

    const url = `https://${region}.chat.agora.io/611421375/1622355/chatgroups/${groupId}/users`;

    const response = await axios.post(
      url,
      {
        usernames: members,
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(
      'Error inviting members:',
      error.response?.data || error.message,
    );

    return NextResponse.json(
      { error: error.response?.data || 'Internal server error' },
      { status: 500 },
    );
  }
}
