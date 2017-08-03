import Suite from 'mocha/lib/suite';

const createDescribe = ({ file, suites }) => (description, content) => {
  const suite = Suite.create(suites[0], description);
  suite.file = file;
  suites.unshift(suite);
  content.call(suite);
  suites.shift();
  return suite;
};

export default createDescribe;
