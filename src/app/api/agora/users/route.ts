import { ChatTokenBuilder } from 'agora-token';

const REGION = 'a61';

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function GET() {
  const appId = process.env.AGORA_APP_ID;
  const appCert = process.env.AGORA_APP_CERTIFICATE;
  const appKey = process.env.NEXT_PUBLIC_AGORA_APP_KEY;

  if (!appId || !appCert || !appKey) {
    return new Response(
      JSON.stringify({ error: 'Missing Agora environment variables' }),
      { status: 500 },
    );
  }

  const [orgName, appName] = appKey.split('#');
  const appToken = ChatTokenBuilder.buildAppToken(appId, appCert, 3600);

  try {
    const res = await fetch(
      `https://${REGION}.chat.agora.io/${orgName}/${appName}/users?pageNum=1&pageSize=100`,
      {
        headers: {
          Authorization: `Bearer ${appToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
