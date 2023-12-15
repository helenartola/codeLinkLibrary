import { getAllPosts, getAllPostsByUserId } from "../DB/postsDb.js";

const getPostsController = async (req, res, next) => {
  try {
    const posts = await getAllPosts();
    res.send({
      status: 'ok',
      message: posts,
    });
  } catch (error) {
    next(error);
  }
};

const newPostController = async (req, res, next) => {
  try {
    res.send({
      status: 'error',
      message: 'Not implemented',
    });
  } catch (error) {
    next(error);
  }
};

const getPostsByUserController = async (req, res, next) => {
  try {
    const {id} = req.params;
    const posts = await getAllPostsByUserId(id);
    res.send({
      status: 'ok',
      message: posts,
    });
  } catch (error) {
    next(error);
  }
};

const deletePostController = async (req, res, next) => {
  try {
    res.send({
      status: 'error',
      message: 'Not implemented',
    });
  } catch (error) {
    next(error);
  }
};

export {
  getPostsController,
  newPostController,
  getPostsByUserController,
  deletePostController,
};
