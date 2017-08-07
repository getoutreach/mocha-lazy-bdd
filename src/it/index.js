import Test from 'mocha/lib/test';

const createIt = ({ file, suites }) => (explanation, expectation) => {
  const [suite] = suites;
  const test = suite.pending ? new Test(explanation) : new Test(explanation, expectation);
  test.file = file;
  suite.addTest(test);
  return test;
};

export default createIt;
