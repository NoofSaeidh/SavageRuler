import { ViewDescriptor } from './view-descriptor';

interface Test {
  id: number;
  name: string;
}

describe('ViewDescriptor', () => {
  it('should create an instance', () => {
    expect(new ViewDescriptor<Test>('test', 'name')).toBeTruthy();
  });
});
