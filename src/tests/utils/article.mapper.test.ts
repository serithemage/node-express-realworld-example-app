import articleMapper from '../../app/routes/article/article.mapper';

describe('articleMapper', () => {
  const baseArticle = {
    slug: 'test-article-1',
    title: 'Test Article',
    description: 'A test',
    body: 'Content here',
    tagList: [{ name: 'tag1' }, { name: 'tag2' }],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    favoritedBy: [{ id: 10 }, { id: 20 }],
    author: {
      username: 'jake',
      bio: 'I work at statefarm',
      image: null,
      followedBy: [{ id: 10 }],
    },
  };

  test('should map tagList to string array', () => {
    const result = articleMapper(baseArticle, 1);
    expect(result.tagList).toEqual(['tag1', 'tag2']);
  });

  test('should calculate favoritesCount', () => {
    const result = articleMapper(baseArticle, 1);
    expect(result.favoritesCount).toBe(2);
  });

  test('should set favorited to true when user has favorited', () => {
    const result = articleMapper(baseArticle, 10);
    expect(result.favorited).toBe(true);
  });

  test('should set favorited to false when user has not favorited', () => {
    const result = articleMapper(baseArticle, 999);
    expect(result.favorited).toBe(false);
  });

  test('should set favorited to false when no user id', () => {
    const result = articleMapper(baseArticle);
    expect(result.favorited).toBe(false);
  });

  test('should map author with following status', () => {
    const result = articleMapper(baseArticle, 10);
    expect(result.author).toEqual({
      username: 'jake',
      bio: 'I work at statefarm',
      image: null,
      following: true,
    });
  });

  test('should set author.following to false when not following', () => {
    const result = articleMapper(baseArticle, 999);
    expect(result.author.following).toBe(false);
  });

  test('should preserve slug, title, description, body, timestamps', () => {
    const result = articleMapper(baseArticle, 1);
    expect(result.slug).toBe('test-article-1');
    expect(result.title).toBe('Test Article');
    expect(result.description).toBe('A test');
    expect(result.body).toBe('Content here');
    expect(result.createdAt).toEqual(new Date('2024-01-01'));
    expect(result.updatedAt).toEqual(new Date('2024-01-01'));
  });
});
