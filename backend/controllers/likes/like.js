import getLikesDB from "../../database/likes/getDB.js";
import getPostsDB from "../../database/posts/getDB.js";

export const likeController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const postId = Number(id);
    const userId = req.session.userId;

    const postsDB = await getPostsDB();
    const likesDB = await getLikesDB();

    const post = await postsDB.get(
      "SELECT username FROM posts WHERE id = ?",
      [postId]
    );
    if (!post) {
      await likesDB.close();
      await postsDB.close();
      return res.status(404).json({ error: "Post not found" });
    }

    const isLiked = await likesDB.get(
      "SELECT * FROM likes WHERE user_id = ? AND post_id = ?",
      [userId, postId]
    );

    if (isLiked) {
      await likesDB.run(
        "DELETE FROM likes WHERE user_id = ? AND post_id = ?",
        [userId, postId]
      );
      await postsDB.run("UPDATE posts SET likes = likes - 1 WHERE id = ?", [postId]);

      const updatedPost = await postsDB.get("SELECT likes FROM posts WHERE id = ?", [postId]);

      await likesDB.close();
      await postsDB.close();
      return res
        .status(200)
        .json({
          message: `You unliked ${post.username}'s post`,
          likes: updatedPost.likes
        });
    } else {
      await likesDB.run(
        "INSERT INTO likes (post_id, user_id) VALUES (?, ?)",
        [postId, userId]
      );

      await postsDB.run("UPDATE posts SET likes = likes + 1 WHERE id = ?", [postId]);

      const updatedPost = await postsDB.get("SELECT likes FROM posts WHERE id = ?", [postId]);

      await likesDB.close();
      await postsDB.close();
      return res
        .status(201)
        .json({
          message: `You successfully liked ${post.username}'s post`,
          likes: updatedPost.likes
        });
    }
  } catch (err) {
    next();
  }
};
