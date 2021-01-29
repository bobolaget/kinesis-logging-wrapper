import {Kinesis, PutRecordCommandOutput, KinesisClientConfig} from '@aws-sdk/client-kinesis';

const defaultKinesisConfig = {};
let kinesis = new Kinesis(defaultKinesisConfig);

export type logLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug';

/** set up kinesis with custom configuration
 */
export function kinesisConfig(kinesisConfig: KinesisClientConfig): void{
  kinesis = new Kinesis(kinesisConfig);
}

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
