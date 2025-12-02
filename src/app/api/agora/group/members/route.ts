import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from 'server';

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const region = 'a61';
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get('groupId');

    if (!groupId) {
      return NextResponse.json(
        { error: 'Group ID is required' },
        { status: 400 },
      );
    }
    const auth = Buffer.from(
      `${process.env.AGORA_CUSTOMER_KEY}:${process.env.AGORA_CUSTOMER_SECRET}`,
    ).toString('base64');

    const url = `https://${region}.chat.agora.io/611421375/1622355/chatgroups/${groupId}/users`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(
      'Error getting group members:',
      error.response?.data || error.message,
    );

    return NextResponse.json(
      { error: error.response?.data || 'Internal server error' },
      { status: 500 },
    );
  }
}
