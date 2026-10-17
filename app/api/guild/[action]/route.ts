import { env } from 'cloudflare:workers';
import { createGuildApi } from '../../../../server/guild-api.mjs';
export const dynamic='force-dynamic';
export async function GET(request:Request){return createGuildApi({db:env.DB})(request);}
export async function POST(request:Request){return createGuildApi({db:env.DB})(request);}
