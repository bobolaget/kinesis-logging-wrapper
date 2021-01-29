import {Kinesis, PutRecordCommandOutput} from '@aws-sdk/client-kinesis';

const kinesisConfig = {};
const kinesis = new Kinesis(kinesisConfig);

export type logLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug';

/** send a log message to AWS kinesis stream
 */
export function logMessageToKinesis(
  message: Object | string,
  level: logLevel,
  streamName: string,
  partitionKey: string = '1'
): Promise<PutRecordCommandOutput | undefined> {

  const messageData = JSON.stringify({
    lvl: level,
    msg: message
  });

  const params = {
    Data: Buffer.from(
      messageData
    ) /* Strings will be Base-64 encoded on your behalf */ /* required */,
    PartitionKey: partitionKey /* required */,
    StreamName: streamName /* required */
    //ExplicitHashKey: 'STRING_VALUE',
    //SequenceNumberForOrdering: 'STRING_VALUE'
  };
  return new Promise((resolve, reject) => {
    kinesis.putRecord(params, function (err: any, data?: PutRecordCommandOutput) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

}
