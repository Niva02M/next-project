import { ChatTokenBuilder } from 'agora-token';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const REGION = 'a61';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Only POST allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const { userId, nickname, avatarurl } = body;

  if (!userId) {
    return new Response(JSON.stringify({ error: 'userId is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const appId = process.env.AGORA_APP_ID;
  const appCert = process.env.AGORA_APP_CERTIFICATE;
  const appKey = process.env.NEXT_PUBLIC_AGORA_APP_KEY;

  if (!appId || !appCert || !appKey) {
    return new Response(JSON.stringify({ error: 'Missing Agora environment variables' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (!appKey.includes('#')) {
    return new Response(
      JSON.stringify({
        error: "NEXT_PUBLIC_AGORA_APP_KEY_1 must be in format 'org_name#app_name'"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const [orgName, appName] = appKey.split('#');
    const appToken = ChatTokenBuilder.buildAppToken(appId, appCert, 3600);

    console.log(`Updating user profile for: ${userId}`);

    if (!nickname && !avatarurl) {
      return new Response(JSON.stringify({ error: 'At least one of nickname or avatarurl must be provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const formData = new URLSearchParams();
    if (nickname?.trim()) formData.append('nickname', nickname.trim());
    if (avatarurl?.trim()) formData.append('avatarurl', avatarurl.trim());

    const updateResp = await fetch(`https://${REGION}.chat.agora.io/${orgName}/${appName}/metadata/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${appToken}`
      },
      body: formData.toString()
    });

    let responseData;
    try {
      responseData = await updateResp.json();
    } catch {
      responseData = { error: 'Failed to parse Agora response' };
    }

    if (!updateResp.ok) {
      console.error('Agora user update failed:', responseData);
      return new Response(
        JSON.stringify({
          error: 'Failed to update user profile',
          details: responseData
        }),
        {
          status: updateResp.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Agora user profile updated successfully:', userId);

    return new Response(
      JSON.stringify({
        status: 'success',
        message: `User ${userId} profile updated successfully`,
        userId,
        nickname: nickname || '',
        avatarurl: avatarurl || ''
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (err: any) {
    console.error('Error updating Agora user:', err);
    return new Response(JSON.stringify({ error: 'Internal server error', message: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ error: 'Only POST allowed' }), {
    status: 405,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
