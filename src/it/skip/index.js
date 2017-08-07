const createItSkip = ({ context }) => (title) => {
  context.it(title);
};

export default createItSkip;
