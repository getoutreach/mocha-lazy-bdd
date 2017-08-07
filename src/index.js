/*global Mocha*/

import MochaImport from 'mocha';

import MochaCommonInterface from 'mocha/lib/interfaces/common';

import createDescribe from './describe';
import createDescribeOnly from './describe/only';
import createDescribeSkip from './describe/skip';

import createIt from './it';
import createItOnly from './it/only';
import createItRetries from './it/retries';
import createItSkip from './it/skip';

import createLazy from './lazy';

import createSubject from './subject';

const MochaLazyBdd = function(suite) {
  const suites = [suite];

  suite.on('pre-require', function(context, file, mocha){
    const common = MochaCommonInterface(suites, context);

    context.after = common.after;
    context.afterEach = common.afterEach;

    context.before = common.before;
    context.beforeEach = common.beforeEach;

    context.describe = createDescribe({ file, suites });
    context.describe.only = createDescribeOnly({ context, mocha });
    context.describe.skip = createDescribeSkip({ suites });

    context.context = context.describe;

    context.it = createIt({ file, suites });
    context.it.only = createItOnly({ context, mocha });
    context.it.retries = createItRetries({ context });
    context.it.skip = createItSkip({ context });

    context.lazy = createLazy({ suites });

    context.run = mocha.options.delay && common.runWithSuite(suite);

    context.specify = context.it;

    context.subject = createSubject({ context });

    context.xcontext = context.context.skip;
    context.xdescribe = context.describe.skip;
    context.xit = context.it.skip;
    context.xspecify = context.specify.skip;
  });
};

if (typeof(Mocha) !== 'undefined') {
  Mocha.interfaces['lazy-bdd'] = MochaLazyBdd;
} else if (typeof(MochaImport) !== 'undefined') {
  MochaImport.interfaces['lazy-bdd'] = MochaLazyBdd;
}

export default MochaLazyBdd;
