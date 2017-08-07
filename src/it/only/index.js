const escapeRegExp = (string) => {
  return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
};

const exactMatch = (string) => {
  return new RegExp(`^${escapeRegExp(string)}$`);
};

const createItOnly = ({ context, mocha }) => (title, content) => {
  const test = context.it(title, content);
  mocha.grep(exactMatch(test.fullTitle()));
  return test;
};

export default createItOnly;
