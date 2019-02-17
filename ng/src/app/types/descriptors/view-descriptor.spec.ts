import { EntityViewDescriptor } from './view-descriptor';

interface Test {
  id: number;
  name: string;
}

describe('ViewDescriptor', () => {
  it('should create an instance', () => {
    expect(new EntityViewDescriptor<Test>({viewType: {typeName: 'Test', titleKey: 'name'}})).toBeTruthy();
  });
});
