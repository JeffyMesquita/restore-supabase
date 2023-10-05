import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface NextRequestWithImage extends NextRequest {
  imageUrl: string;
}

export async function POST(req: NextRequestWithImage, res: NextResponse) {
  const { imageUrl } = await req.json();

  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (!session || error) {
    new NextResponse('Unauthorized', { status: 401 });
  }

  const startRestoreProcess = await fetch(
    'https://api.replicate.ai/v1/predictions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + process.env.REPLICATE_API_TOKEN,
      },
      body: JSON.stringify({
        version:
          '9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3',
        input: {
          img: imageUrl,
          version: 'v1.4',
          scale: 2,
        },
      }),
    }
  );

  let jsonStartProcessResponse = await startRestoreProcess.json();

  let endPointUrl = jsonStartProcessResponse.urls.get;

  let restoredImage: string | null = null;

  while (!restoredImage) {
    console.log('Waiting for image to be restored...');

    let finalResponse = await fetch(endPointUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + process.env.REPLICATE_API_TOKEN,
      },
    });

    let jsonFinalResponse = await finalResponse.json();

    if (jsonFinalResponse.status === 'succeeded') {
      restoredImage = jsonFinalResponse.output;
    } else if (jsonFinalResponse.status === 'failed') {
      break; //TODO: Handle error
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return NextResponse.json(
    {
      data: restoredImage ? restoredImage : "Couldn't restore image",
    },
    { status: 200 }
  );
}
