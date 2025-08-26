const fs = require('fs');
const path = require('path');
const commentsFile = path.join(__dirname, '../data/comments.json');

const readComments = () => JSON.parse(fs.readFileSync(commentsFile));
const writeComments = (data) => fs.writeFileSync(commentsFile, JSON.stringify(data, null, 2));

exports.getAllComments = (req, res) => res.json(readComments());

exports.getCommentById = (req, res) => {
  const comment = readComments().find(c => c.id === parseInt(req.params.id));
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  res.json(comment);
};

exports.createComment = (req, res) => {
  const { postId, userId, text } = req.body;
  if (!postId || !userId || !text) return res.status(400).json({ error: 'postId, userId, text required' });
  const comments = readComments();
  const newComment = { id: comments.length + 1, postId, userId, text };
  comments.push(newComment);
  writeComments(comments);
  res.status(201).json(newComment);
};

exports.updateComment = (req, res) => {
  const comments = readComments();
  const comment = comments.find(c => c.id === parseInt(req.params.id));
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  comment.text = req.body.text || comment.text;
  writeComments(comments);
  res.json(comment);
};

exports.deleteComment = (req, res) => {
  let comments = readComments();
  comments = comments.filter(c => c.id !== parseInt(req.params.id));
  writeComments(comments);
  res.status(204).send();
};
