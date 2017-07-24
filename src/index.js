/*global Mocha*/

import MochaImport from 'mocha';

import MochaCommonInterface from 'mocha/lib/interfaces/common';
import Suite from 'mocha/lib/suite';
import Test from 'mocha/lib/test';

const MochaLazyBdd = function(suite) {
  const suites = [suite];
  let cache = {};
  let isInsideTest = false;

  suite.on('pre-require', function(context, file, mocha){
    const common = MochaCommonInterface(suites, context);

    context.before = common.before;
    context.after = common.after;
    context.beforeEach = common.beforeEach;
    context.afterEach = common.afterEach;
    context.run = mocha.options.delay && common.runWithSuite(suite);

    suite.beforeEach(function() {
      cache = {};
      isInsideTest = false;
    });

    context.lazy = function(name, initializer) {
      Object.defineProperty(suites[0].ctx, name, {
        configurable: true,
        enumerable: false,
        get: function() {
          if (!isInsideTest) {
            if (this.currentTest) {
              if (this.currentTest.ctx) {
                isInsideTest = true;
                return this.currentTest.ctx[name];
              }
            }
          }
          if(!(name in cache)) {
            cache[name] = initializer.call(this);
          }
          isInsideTest = false;
          return cache[name];
        },
        set: function() {
          throw new Error(`Use lazy('${name}', …) instead of this.${name}=`);
        }
      });
    };

    context.subject = function(initializer) {
      context.lazy.call(this, 'subject', initializer);
    };

    context.context = function(description, content) {
      const suite = Suite.create(suites[0], description);
      suite.file = file;
      suites.unshift(suite);
      content.call(suite);
      suites.shift();
      return suite;
    };

    context.describe = context.context;

    context.it = function(explanation, expectation) {
      const [suite] = suites;
      const test = suite.pending ? new Test(explanation) : new Test(explanation, expectation);
      test.file = file;
      suite.addTest(test);
      return test;
    };
  });
};

if (typeof(Mocha) !== 'undefined') {
  Mocha.interfaces['lazy-bdd'] = MochaLazyBdd;
} else if (typeof(MochaImport) !== 'undefined') {
  MochaImport.interfaces['lazy-bdd'] = MochaLazyBdd;
}

export default MochaLazyBdd;
