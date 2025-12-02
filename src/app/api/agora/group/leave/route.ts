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
    const { groupId } = await req.json();
    const userId = session.user.id || session.user.email;

    if (!groupId) {
      return NextResponse.json(
        { error: 'Group ID is required' },
        { status: 400 },
      );
    }

    console.log('🚪 Leaving group:', { groupId, userId });

    // Use Basic Auth - same as group creation
    const auth = Buffer.from(
      `${process.env.AGORA_CUSTOMER_KEY}:${process.env.AGORA_CUSTOMER_SECRET}`,
    ).toString('base64');

    const url = `https://${region}.chat.agora.io/611421375/1622355/chatgroups/${groupId}/users/${userId}`;

    console.log('API URL:', url);

    const response = await axios.delete(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Successfully left group:', response.data);

    return NextResponse.json({
      success: true,
      message: 'Successfully left the group',
      data: response.data,
    });
  } catch (error: any) {
    console.error('❌ Error leaving group:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    const errorMessage =
      error.response?.data?.error_description ||
      error.response?.data?.error ||
      error.message ||
      'Failed to leave group';

    return NextResponse.json(
      { error: errorMessage },
      { status: error.response?.status || 500 },
    );
  }
}
