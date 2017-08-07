const createDescribeOnly = ({ context, mocha }) => (title, content) => {
  const suite = context.describe(title, content);
  mocha.grep(suite.fullTitle());
  return suite;
};

export default createDescribeOnly;
