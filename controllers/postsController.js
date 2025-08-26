const fs = require('fs');
const path = require('path');
const postsFile = path.join(__dirname, '../data/posts.json');

const readPosts = () => JSON.parse(fs.readFileSync(postsFile));
const writePosts = (data) => fs.writeFileSync(postsFile, JSON.stringify(data, null, 2));

exports.getAllPosts = (req, res) => res.json(readPosts());

exports.getPostById = (req, res) => {
  const post = readPosts().find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
};

exports.createPost = (req, res) => {
  const { title, content, userId } = req.body;
  if (!title || !content || !userId) return res.status(400).json({ error: 'Title, content, and userId required' });
  const posts = readPosts();
  const newPost = { id: posts.length + 1, title, content, userId };
  posts.push(newPost);
  writePosts(posts);
  res.status(201).json(newPost);
};

exports.updatePost = (req, res) => {
  const posts = readPosts();
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: 'Post not found' });
  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;
  writePosts(posts);
  res.json(post);
};

exports.deletePost = (req, res) => {
  let posts = readPosts();
  posts = posts.filter(p => p.id !== parseInt(req.params.id));
  writePosts(posts);
  res.status(204).send();
};
