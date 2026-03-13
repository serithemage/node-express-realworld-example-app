import prismaMock from '../prisma-mock';
import {
  addComment,
  createArticle,
  deleteArticle,
  deleteComment,
  favoriteArticle,
  getArticle,
  getCommentsByArticle,
  unfavoriteArticle,
  updateArticle,
} from '../../app/routes/article/article.service';

const mockAuthor = {
  username: 'RealWorld',
  bio: null,
  image: null,
  followedBy: [],
};

const mockArticle = {
  id: 1,
  slug: 'How-to-train-your-dragon-1',
  title: 'How to train your dragon',
  description: 'Ever wonder how?',
  body: 'You have to believe',
  createdAt: new Date(),
  updatedAt: new Date(),
  authorId: 1,
  tagList: [{ name: 'dragons' }],
  favoritedBy: [],
  author: mockAuthor,
  _count: { favoritedBy: 0 },
};

describe('ArticleService', () => {
  describe('createArticle', () => {
    test('should create a new article', async () => {
      const input = {
        title: 'How to train your dragon',
        description: 'Ever wonder how?',
        body: 'You have to believe',
        tagList: ['dragons'],
      };

      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(null);
      // @ts-ignore
      prismaMock.article.create.mockResolvedValue(mockArticle);

      const result = await createArticle(input, 1);
      expect(result).toHaveProperty('slug');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('tagList');
    });

    test('should throw when title is empty', async () => {
      const input = { title: '', description: 'desc', body: 'body', tagList: [] };
      await expect(createArticle(input, 1)).rejects.toThrowError();
    });

    test('should throw when description is empty', async () => {
      const input = { title: 'title', description: '', body: 'body', tagList: [] };
      await expect(createArticle(input, 1)).rejects.toThrowError();
    });

    test('should throw when body is empty', async () => {
      const input = { title: 'title', description: 'desc', body: '', tagList: [] };
      await expect(createArticle(input, 1)).rejects.toThrowError();
    });

    test('should throw when slug already exists', async () => {
      const input = {
        title: 'How to train your dragon',
        description: 'desc',
        body: 'body',
        tagList: [],
      };

      prismaMock.article.findUnique.mockResolvedValue({ slug: 'How-to-train-your-dragon-1' } as any);
      await expect(createArticle(input, 1)).rejects.toThrowError();
    });
  });

  describe('getArticle', () => {
    test('should return an article by slug', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(mockArticle);

      const result = await getArticle('How-to-train-your-dragon-1', 1);
      expect(result).toHaveProperty('slug', 'How-to-train-your-dragon-1');
      expect(result).toHaveProperty('author');
    });

    test('should throw 404 when article not found', async () => {
      prismaMock.article.findUnique.mockResolvedValue(null);
      await expect(getArticle('nonexistent', 1)).rejects.toThrowError();
    });
  });

  describe('updateArticle', () => {
    test('should throw 404 when article not found', async () => {
      prismaMock.article.findFirst.mockResolvedValue(null);
      await expect(updateArticle({ title: 'new' }, 'nonexistent', 1)).rejects.toThrowError();
    });

    test('should throw 403 when user is not the author', async () => {
      prismaMock.article.findFirst.mockResolvedValue({
        author: { id: 999, username: 'other' },
      } as any);

      await expect(updateArticle({ title: 'new' }, 'some-slug', 1)).rejects.toThrowError();
    });
  });

  describe('deleteArticle', () => {
    test('should throw 404 when article not found', async () => {
      prismaMock.article.findFirst.mockResolvedValue(null);
      await expect(deleteArticle('nonexistent', 1)).rejects.toThrowError();
    });

    test('should throw 403 when user is not the author', async () => {
      prismaMock.article.findFirst.mockResolvedValue({
        author: { id: 999, username: 'other' },
      } as any);

      await expect(deleteArticle('some-slug', 1)).rejects.toThrowError();
    });

    test('should delete the article', async () => {
      prismaMock.article.findFirst.mockResolvedValue({
        author: { id: 1, username: 'me' },
      } as any);
      prismaMock.article.delete.mockResolvedValue(mockArticle as any);

      await expect(deleteArticle('some-slug', 1)).resolves.toBeUndefined();
    });
  });

  describe('deleteComment', () => {
    test('should throw an error when comment not found', () => {
      // @ts-ignore
      prismaMock.comment.findFirst.mockResolvedValue(null);
      expect(deleteComment(123, 456)).rejects.toThrowError();
    });

    test('should throw 403 when user is not the comment author', async () => {
      prismaMock.comment.findFirst.mockResolvedValue({
        author: { id: 999, username: 'other' },
      } as any);

      await expect(deleteComment(123, 1)).rejects.toThrowError();
    });
  });

  describe('addComment', () => {
    test('should throw when body is empty', async () => {
      await expect(addComment('', 'some-slug', 1)).rejects.toThrowError();
    });

    test('should create a comment', async () => {
      prismaMock.article.findUnique.mockResolvedValue({ id: 1 } as any);
      prismaMock.comment.create.mockResolvedValue({
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        body: 'Great article!',
        author: mockAuthor,
      } as any);

      const result = await addComment('Great article!', 'some-slug', 1);
      expect(result).toHaveProperty('body', 'Great article!');
      expect(result).toHaveProperty('author');
    });
  });

  describe('favoriteArticle', () => {
    test('should return the favorited article', async () => {
      // @ts-ignore
      prismaMock.article.update.mockResolvedValue(mockArticle);

      await expect(favoriteArticle('How-to-train-your-dragon', 123)).resolves.toHaveProperty(
        'favoritesCount',
      );
    });
  });

  describe('unfavoriteArticle', () => {
    test('should return the unfavorited article', async () => {
      // @ts-ignore
      prismaMock.article.update.mockResolvedValue(mockArticle);

      await expect(unfavoriteArticle('How-to-train-your-dragon', 123)).resolves.toHaveProperty(
        'favoritesCount',
      );
    });
  });
});
