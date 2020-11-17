/* eslint-disable no-console */
import https from 'https';
import xml2js from 'xml2js';
import iconv from 'iconv-lite';
import { getClient } from '../utils/getClient';
import {
  getCurrencies,
  getCurrency,
  updateCurrency,
  upsertCurrency,
} from '../utils/operations';
// import prisma from '../prisma';
// import url from "url";

type el = {
  $: { ID: string };
  NumCode: [string];
  CharCode: [string];
  Nominal: [string];
  Name: [string];
  Value: [string];
};

const dailyUrl = 'https://www.cbr.ru/scripts/XML_daily.asp';
const dailyEnUrl = 'https://www.cbr.ru/scripts/XML_daily_eng.asp';

const xmlParser = new xml2js.Parser();

const client = getClient();

const cbr = (): void => {
  const dailyUrlRequest = https.get(dailyUrl, async response => {
    const { statusCode } = response;
    const contentType = response.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
    } else if (!/^application\/xml/.test(contentType as string)) {
      error = new Error(
        'Invalid content-type.\n' +
          `Expected application/xml but received ${contentType}`
      );
    }

    // if (statusCode > 300 && statusCode < 400 && response.headers.location) {
    //   console.log(response.headers.location);
    //   // The location for some (most) redirects will only contain the path,  not the hostname;
    //   // detect this and add the host to the path.
    //   if (url.parse(response.headers.location).hostname) {
    //     console.log("Hostname included; make request to res.headers.location");
    //   } else {
    //     console.log(
    //       "Hostname not included; get host from requested URL (url.parse()) and prepend to location."
    //     );
    //     console.log(url.parse(`https://www.cbr.ru${response.headers.location}`));
    //   }
    //   // Otherwise no redirect; capture the response as normal
    // }

    if (error) {
      console.error('error', error);
    }

    // if (error) {
    //   console.error(error.message);
    //   // Consume response data to free up memory
    //   await prisma.mutation.createHeroku({
    //     data: {
    //       result: error.message,
    //     },
    //   });
    //   response.resume();
    //   return;
    // }

    // save the data
    const xmlChunks: Uint8Array[] = [];
    response.on('data', chunk => {
      xmlChunks.push(chunk);
    });
    response.on('end', () => {
      const decodedXmlBody = iconv.decode(
        Buffer.concat(xmlChunks),
        'windows-1251'
      );
      // parse xml
      // console.log(decodedXmlBody);

      xmlParser.parseString(
        decodedXmlBody,
        async (error: any, result: { ValCurs: { Valute: el[] } }) => {
          if (result) {
            // const dateArray = result.ValCurs.$.Date.split(".").map(Number);
            // const date = new Date(dateArray[2], dateArray[1] - 1, dateArray[0], 12);
            // console.log(date.valueOf());
            // const date2 = new Date();
            // console.log(date2.valueOf());
            // console.dir(result.ValCurs.$.Date);
            // console.log(new Date());
            // console.dir(result.ValCurs.Valute.length);
            result.ValCurs.Valute.forEach(async (element: el) => {
              await client.request(upsertCurrency, {
                where: {
                  charCode: element.CharCode[0],
                },
                create: {
                  name: element.Name[0],
                  nominal: Number(element.Nominal[0]),
                  charCode: element.CharCode[0],
                  value: Number(
                    element.Value[0].match(',')
                      ? element.Value[0].replace(',', '.')
                      : element.Value[0]
                  ),
                },
                update: {
                  // name: element.Name[0],
                  nominal: Number(element.Nominal[0]),
                  // charCode: element.CharCode[0],
                  value: Number(
                    element.Value[0].match(',')
                      ? element.Value[0].replace(',', '.')
                      : element.Value[0]
                  ),
                },
              });
            });

            // const enTrue = await client.request(getCurrency, {
            //   where: {
            //     nameEng: 'Belarussian Ruble',
            //   },
            // });

            // if (!enTrue || result.ValCurs.Valute.length !== 34) {
            //   const dailyEnUrlRequest = https.get(dailyEnUrl, response => {
            //     const xmlChunks: Uint8Array[] = [];
            //     response.on('data', chunk => {
            //       xmlChunks.push(chunk);
            //     });
            //     response.on('end', () => {
            //       const decodedXmlBody = iconv.decode(
            //         Buffer.concat(xmlChunks),
            //         'windows-1251'
            //       );
            //       xmlParser.parseString(
            //         decodedXmlBody,
            //         (error: any, result: { ValCurs: { Valute: el[] } }) => {
            //           if (result) {
            //             result.ValCurs.Valute.forEach(async element => {
            //               console.log(element);
            //               // await await client.request(updateCurrency, {
            //               //   where: {
            //               //     charCode: element.CharCode[0],
            //               //   },
            //               //   data: {
            //               //     nameEng: element.Name[0],
            //               //   },
            //               // });
            //             });
            //           } else if (error) {
            //             console.log(error);
            //           }
            //         }
            //       );
            //     });
            //   });
            //   dailyEnUrlRequest.on('error', error => {
            //     console.log(error);
            //   });
            // }
          } else if (error) {
            console.log(error);
          }
        }
      );
    });
  });

  dailyUrlRequest.on('error', error => {
    // debug error
    console.log(error);
  });
};

export default cbr;
