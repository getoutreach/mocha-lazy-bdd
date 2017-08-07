const createItRetries = ({ context }) => (n) => {
  context.retries(n);
};

export default createItRetries;
