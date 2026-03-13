import authorMapper from '../../app/routes/article/author.mapper';

describe('authorMapper', () => {
  test('should map author with following=true when user follows', () => {
    const author = {
      username: 'jake',
      bio: 'I work at statefarm',
      image: 'https://example.com/photo.jpg',
      followedBy: [{ id: 10 }, { id: 20 }],
    };

    const result = authorMapper(author, 10);
    expect(result).toEqual({
      username: 'jake',
      bio: 'I work at statefarm',
      image: 'https://example.com/photo.jpg',
      following: true,
    });
  });

  test('should map author with following=false when user does not follow', () => {
    const author = {
      username: 'jake',
      bio: null,
      image: null,
      followedBy: [{ id: 10 }],
    };

    const result = authorMapper(author, 999);
    expect(result).toEqual({
      username: 'jake',
      bio: null,
      image: null,
      following: false,
    });
  });

  test('should map author with following=false when no user id', () => {
    const author = {
      username: 'jake',
      bio: null,
      image: null,
      followedBy: [{ id: 10 }],
    };

    const result = authorMapper(author, undefined);
    expect(result).toEqual({
      username: 'jake',
      bio: null,
      image: null,
      following: false,
    });
  });

  test('should map author with following=false when followedBy is empty', () => {
    const author = {
      username: 'jake',
      bio: null,
      image: null,
      followedBy: [],
    };

    const result = authorMapper(author, 10);
    expect(result).toEqual({
      username: 'jake',
      bio: null,
      image: null,
      following: false,
    });
  });
});
