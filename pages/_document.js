// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link href="//db.onlinewebfonts.com/c/f05f148ec6596f0b75375fa566aaf1fe?family=Bely" rel="stylesheet" type="text/css"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}