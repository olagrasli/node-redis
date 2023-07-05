import { strict as assert } from 'assert';
import testUtils, { GLOBAL, MIN_BLOCKING_TIME } from '../test-utils';
import BLMPOP from './BLMPOP';

describe('BLMPOP', () => {
  testUtils.isVersionGreaterThanHook([7]);

  describe('transformArguments', () => {
    it('simple', () => {
      assert.deepEqual(
        BLMPOP.transformArguments(0, 'key', 'LEFT'),
        ['BLMPOP', '0', '1', 'key', 'LEFT']
      );
    });

    it('with COUNT', () => {
      assert.deepEqual(
        BLMPOP.transformArguments(0, 'key', 'LEFT', {
          COUNT: 1
        }),
        ['BLMPOP', '0', '1', 'key', 'LEFT', 'COUNT', '1']
      );
    });
  });

  testUtils.testAll('blmPop - null', async client => {
    assert.equal(
      await client.blmPop(MIN_BLOCKING_TIME, 'key', 'RIGHT'),
      null
    );
  }, {
    client: GLOBAL.SERVERS.OPEN,
    cluster: GLOBAL.CLUSTERS.OPEN
  });

  testUtils.testAll('blmPop - with member', async client => {
    const [, reply] = await Promise.all([
      client.lPush('key', 'element'),
      client.blmPop(MIN_BLOCKING_TIME, 'key', 'RIGHT')
    ]);
    assert.deepEqual(reply, [
      'key',
      ['element']
    ]);
  }, {
    client: GLOBAL.SERVERS.OPEN,
    cluster: GLOBAL.CLUSTERS.OPEN
  });  
});
