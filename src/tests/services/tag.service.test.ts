import prismaMock from '../prisma-mock';
import getTags from '../../app/routes/tag/tag.service';

describe('TagService', () => {
  describe('getTags', () => {
    test('should return a list of tag names', async () => {
      const mockedTags = [{ name: 'dragons' }, { name: 'training' }, { name: 'reactjs' }];

      // @ts-ignore - Prisma circular type issue
      prismaMock.tag.findMany.mockResolvedValue(mockedTags);

      const result = await getTags();
      expect(result).toEqual(['dragons', 'training', 'reactjs']);
    });

    test('should return empty array when no tags exist', async () => {
      // @ts-ignore
      prismaMock.tag.findMany.mockResolvedValue([]);

      const result = await getTags();
      expect(result).toEqual([]);
    });

    test('should filter by demo and current user when id provided', async () => {
      const mockedTags = [{ name: 'mytag' }];
      // @ts-ignore
      prismaMock.tag.findMany.mockResolvedValue(mockedTags);

      const result = await getTags(123);
      expect(result).toEqual(['mytag']);
      expect(prismaMock.tag.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
          orderBy: expect.any(Object),
        }),
      );
    });
  });
});
