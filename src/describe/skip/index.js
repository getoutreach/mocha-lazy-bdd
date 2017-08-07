import Suite from 'mocha/lib/suite';

const createDescribeSkip = ({ suites }) => (title, content) => {
  const suite = Suite.create(suites[0], title);
  suite.pending = true;
  suites.unshift(suite);
  content.call(suite);
  suites.shift();
  return suite;
};

export default createDescribeSkip;
