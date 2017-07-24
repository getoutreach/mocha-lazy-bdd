import chai from 'chai';

const { expect } = chai;

describe('mocha-lazy-bdd', function() {
  describe('lazy', function() {
    var hitCount;
    beforeEach(function() {
      hitCount = 0;
    });

    lazy('value', function() {
      hitCount++;
      return 'i am lazy';
    });

    lazy('anotherValue', function() {
      return this.value + '(er)';
    });

    it('returns the specified value', function() {
      expect(this.value).to.eq('i am lazy');
    });

    it('evaluates lazily', function() {
      expect(hitCount).to.eq(0);
      this.value;
      expect(hitCount).to.eq(1);
    });

    it('caches the result', function() {
      expect(this.value).to.eq('i am lazy');
      expect(this.value).to.eq('i am lazy');
      expect(hitCount).to.eq(1);
    });

    it('can depend on other lazy values', function() {
      expect(this.anotherValue).to.eq('i am lazy(er)');
    });

    it('should throw an error when setting it directly', function() {
      expect(() => {
        this.value = 'foo';
      }).to.throw(Error);
    });

    context('inside a nested context', function() {

      it('evaluates lazily', function() {
        expect(hitCount).to.eq(0);
        this.value;
        expect(hitCount).to.eq(1);
      });

    });

    context('inside a nested context with an overridden value', function() {
      lazy('value', function() {
        return 'lazier';
      });

      it('can be overridden', function() {
        expect(this.value).to.eq('lazier');
      });

      it('can depend on other overridden lazy values', function() {
        expect(this.anotherValue).to.eq('lazier(er)');
      });

      context('with a beforeEach caching the used values', function() {
        beforeEach(function() {
          // when calling otherValue twice, the insideTest would still be true for the next
          // getter. Which would then erroneously use this.value from the scope of the
          // beforeEach instead of the scope of the running test
          this.otherValue;
          this.otherValue;
          this.value;
        });

        lazy('otherValue', function() {
          return 'otherValue';
        });

        lazy('value', function() {
          return 'moreLazy';
        });

        it('uses the correct value', function(){
          expect(this.value).to.eq('moreLazy');
        });

        context('with some more nesting', function() {
          lazy('value', function(){
            return 'superLazy';
          });

          it('uses the correct value', function() {
            expect(this.value).to.eq('superLazy');
          });
        });
      });
    });

  });

  describe('subject', function() {
    subject(function() {
      return 'laziness';
    });

    it('can be accessed via this.subject', function() {
      expect(this.subject).to.eq('laziness');
    });
  });

  describe('beforeEach', function() {

    lazy('value', function() {
      return 'override me';
    });

    beforeEach('set an eager value', function() {
      this.eagerValue = this.value;
    });

    it('has access to lazy values', function() {
      expect(this.eagerValue).to.eq('override me');
    });

    context('inside a nested context', function() {

      it('has access to lazy values', function() {
        expect(this.eagerValue).to.eq('override me');
      });

    });

    context('inside a nested context with an overridden value', function() {

      lazy('value', function() {
        return 'couch potato';
      });

      it('has access to the overriden value', function() {
        expect(this.eagerValue).to.eq('couch potato');
      });

    });
  });

});
