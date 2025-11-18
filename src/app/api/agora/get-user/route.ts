import { ChatTokenBuilder } from 'agora-token';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS'
};

const REGION = 'a61';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

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

  const [orgName, appName] = appKey.split('#');
  const appToken = ChatTokenBuilder.buildAppToken(appId, appCert, 3600);

  try {
    const res = await fetch(`https://${REGION}.chat.agora.io/${orgName}/${appName}/metadata/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${appToken}`
      }
    });

    const data = await res.json();

    return new Response(JSON.stringify(data, null, 2), {
      status: res.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch user data from Agora',
        message: err.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}
