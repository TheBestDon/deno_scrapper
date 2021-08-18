import { ServerRequest  } from "https://deno.land/std@0.105.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.13-alpha/deno-dom-wasm.ts";
import { config } from 'https://deno.land/x/dotenv@v3.0.0/mod.ts';
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const { GMAIL_USER, GMAIL_PASS } = config()
interface ConnectTLS {
    hostname: string,
    port: number,
    username: string,
    password: string
}
interface SendData {
    from: string,
    to: string,
    subject: string,
    content: string
}

const connectData = {
    hostname: "smtp.gmail.com",
    port: 465,
    username: 'filters2sell@gmail.com',
    password: 'WB$`d4&x&@P`wntt^fQsc',
}
const sendData = {
    from: "filters2sell@gmail.com",
    to: "suit4ult@gmail.com",
    subject: "Auction in Vilnius",
    content: "Hey, Don! Please check <a href='https://online-auction.state.gov/en-US'>here</a> to see US ambasy auction in Vilnius, LT"
}

const desiredLocation = 'taipei'

const auctionAvailable = (name: string) => {
    return name.toLowerCase().includes(desiredLocation)
}
const sendEmailNotification = async (connectTLS: ConnectTLS, sendData: SendData) => {
    const client = new SmtpClient()

        await client.connectTLS(connectTLS)
        await client.send(sendData)
          await client.close()
}

export default async (req: ServerRequest) => {
  const res = await fetch('https://online-auction.state.gov/en-US')
  const html = await res.text();
  const doc: any = new DOMParser().parseFromString(html, 'text/html');

  const allCities = doc.querySelectorAll('div.label-postname > div:nth-child(2)')

  allCities.forEach((city: any) => {
    const name = city.childNodes[0].data || ''

    if (auctionAvailable(name)) {
        sendEmailNotification(connectData, sendData)
    }
  })
  req.respond({ body: `Hello, from Deno v${Deno.version.deno}!` });
}
