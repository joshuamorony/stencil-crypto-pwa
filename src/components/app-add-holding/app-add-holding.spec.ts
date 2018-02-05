import { render } from '@stencil/core/testing';
import { AppAddHolding } from './app-add-holding';

describe('app app holding', () => {
  it('should build', () => {
    expect(new AppAddHolding()).toBeTruthy();
  });

  describe('rendering', () => {
    beforeEach(async () => {
      await render({
        components: [AppAddHolding],
        html: '<app-add-holding></app-add-holding>'
      });
    });
  });
});