const createLazy = ({ suites }) => {
  let cache = {};
  let isInsideTest = false;

  suites[0].beforeEach(() => {
    cache = {};
    isInsideTest = false;
  });

  return (name, initializer) => {
    const prototype = suites[0].ctx;
    Object.defineProperty(prototype, name, {
      configurable: true,
      enumerable: false,
      get() {
        if (!isInsideTest) {
          if (this.currentTest) {
            if (this.currentTest.ctx) {
              isInsideTest = true;
              return this.currentTest.ctx[name];
            }
          }
        }
        if(!(name in cache)) {
          this._super = Object.getPrototypeOf(prototype);
          try {
            cache[name] = initializer.call(this);
          } finally {
            delete this._super;
          }
        }
        isInsideTest = false;
        return cache[name];
      },
      set() {
        throw new Error(`Use lazy('${name}', …) instead of this.${name}=`);
      }
    });
  };
};

export default createLazy;
