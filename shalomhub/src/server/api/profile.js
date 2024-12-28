const express = require('express');
const User = require('../models/User');
const router = express.Router();

// pobranie danych profilu użytkownika
router.get('/', async (req, res) => {
  const userEmail = req.query.email;

  if (!userEmail) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email: userEmail }).populate('friends');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      description: user.description,
      friends: user.friends
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// edytowanie danych profilu użytkownika
router.put('/', async (req, res) => {
  const { email, firstName, lastName, description } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.description = description || user.description;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        description: user.description
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dodawanie znajomego
router.post('/:userId/friends/add', async (req, res) => {
  const { userId } = req.params;
  const { friendEmail } = req.body;

  // dekodowanie - problem ze znakami specjalnymi w zapytaniu
  const decodedUserId = decodeURIComponent(userId); 
  const decodedFriendEmail = decodeURIComponent(friendEmail); 

  if (!decodedUserId || !decodedFriendEmail) {
    return res.status(400).json({ message: 'Both userId and friendEmail are required' });
  }

  try {
    const user = await User.findOne({ email: decodedUserId });
    const friend = await User.findOne({ email: decodedFriendEmail });

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    user.friends.push(friend);
    friend.friends.push(user);

    await user.save();
    await friend.save();

    res.status(200).json({ message: 'Friend added successfully' });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
