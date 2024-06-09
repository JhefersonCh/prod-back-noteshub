const { User, Note } = require("../models");

const validateUserExistence = async (userId, res) => {
  if(!userId){
    res.status(400).json({ error: 'User ID is required.' });
    return false;
  }
  const userExist = await User.findByPk(userId);
  if(!userExist){
    res.status(404).json({ error: 'User does not exist.' });
    return false;
  }
  return userExist;
}

exports.createNote = async (req, res) => {
  try {
    const { title, content, userId, tags } = req.body;

    if(!title || !content || !userId){
      return res.status(400).json({ error: 'Title, content, and user ID are required.' });
    }

    const userExist = await validateUserExistence(userId, res);
    if(!userExist) return;

    const noteCreated = await Note.create({
      title,
      content,
      userId,
      tags
    });

    return res.status(201).json({
      message: 'Note created successfully.',
      data: noteCreated
    });

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

exports.deleteNote = async (req, res) => {
  try {
    const { id, userId } = req.body;

    console.log({id, userId});

    if(!id){
      return res.status(400).json({ error: 'Note ID is required.' });
    }

    const noteExist = await Note.findByPk(id);
    if(!noteExist){
      return res.status(404).json({ error: 'Note does not exist.' });
    }

    const userExist = await validateUserExistence(userId, res);
    if(!userExist) return;

    if(noteExist.userId !== userExist.id){
      return res.status(403).json({ error: 'Unauthorized to delete this note.' });
    }

    await Note.destroy({ where: { id } });

    return res.status(200).json({
      message: 'Note deleted successfully.',
      data: noteExist
    });

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

exports.changeNoteState = async (req, res) => {

  const { id, status, userId } = req.body;
  if(!id || !status || !userId) return res.status(400).json({ error: 'Id, status and user are required.' });

  try {
    const noteExist = await Note.findByPk(id);
    if(!noteExist) return res.status(404).json({ error: 'Note does not exist.' });

    const userExist = await validateUserExistence(userId, res);
    if(!userExist) return;

    if(noteExist.userId !== userExist.id){
      return res.status(403).json({ error: 'Unauthorized to update this note.' });
    }

    const [affectedRows] = await Note.update({
      status
    }, 
    {
      where: { id }
    });

    if (affectedRows === 0) {
      return res.status(400).json({ message: 'No note was updated.' });
    }

    return res.status(200).json({
      message: 'Status changed successfully.',
      data: noteExist
    });

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

exports.updateNote = async (req, res) => {
  try {
    const { id, title, content, userId, tags } = req.body;

    if(!id){
      return res.status(400).json({ error: 'Note ID is required.' });
    }

    const userExist = await validateUserExistence(userId, res);
    if(!userExist) return;

    const noteExist = await Note.findByPk(id);
    if(!noteExist){
      return res.status(404).json({ error: 'Note does not exist.' });
    }

    if(noteExist.userId !== userExist.id){
      return res.status(403).json({ error: 'Unauthorized to update this note.' });
    }

    const [affectedRows] = await Note.update({
      title,
      content,
      tags
    }, 
    {
      where: { id }
    });

    if (affectedRows === 0) {
      return res.status(400).json({ message: 'No note was updated.' });
    }

    return res.status(200).json({
      message: 'Note updated successfully.',
      data: noteExist
    });

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

exports.getAllByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const userExist = await validateUserExistence(userId, res);
    if(!userExist) return;

    const notes = await Note.findAll({ where: { userId }, order: [['id', 'ASC']] });

    if (!notes || notes.length === 0) {
      return res.status(404).json({ error: "You don't have notes.", data: { notes } });
    }

    return res.status(200).json({
      data: { notes }
    });

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
}