const createSubject = ({ context }) => function(...parameters) {
  const name = parameters.length === 1 ? 'subject' : parameters[0];
  const initializer = parameters[parameters.length - 1];
  context.lazy.call(this, name, initializer);
};

export default createSubject;
