import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

//公钥
export const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCCOigo/ypuCvx67zBawmJ3UkbAivNfu/jTIxyhzHulxeEuInzrig8vwsI2eKjm\n' +
  '/ItQc6fKNndCgWl73yPr0yFCzwQ2Ez4A37O5VsbWBSlyB4/UOzAnTTKutIgFPGX4jVZBm+XH43jQs/H1Y8m1dF2cGOCWdsbH9uCtoDkviOppJQIDAQAB';

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}
