import { ServerRequest, DOMParser } from "../deps.ts";

export default async (req: ServerRequest) => {
  const res = await fetch('https://online-auction.state.gov/en-US')
  const html = await res.text();
  const doc: any = new DOMParser().parseFromString(html, 'text/html');
  req.respond({ body: `Hello, from Deno v${Deno.version.deno}!` });
}