const express = require('express');
const User = require('../models/User');
const Notification = require('../models/Notification');
const router = express.Router();
const { io } = require("../server");

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

  // Dekodowanie - problem ze znakami specjalnymi w zapytaniu
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

    // Dodanie użytkownika do listy znajomych
    user.friends.push(friend);
    friend.friends.push(user);

    await user.save();
    await friend.save();

    // Tworzymy powiadomienie o dodaniu do znajomych
    if (user.email !== friend.email) {
      const notification = new Notification({
        type: 'friend',
        recipient: friend._id,  // Odbiorca powiadomienia to dodany znajomy
        sender: user._id,       // Nadawca to użytkownik, który dodał do znajomych
        relatedObject: null,    // Brak powiązanego obiektu
        relatedObjectType: null, // Brak powiązanego obiektu
        message: `${user.email} added you as a friend!`,  // Treść powiadomienia
        isRead: false,
      });

      await notification.save();

      // Emitowanie powiadomienia do autora posta przez WebSocket
      io.to(friend.email).emit("notification", {
        message: notification.message,
        type: "friend",
        senderEmail: user.email,
      });
    }

    res.status(200).json({ message: 'Friend added successfully' });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Wyszukiwanie użytkowników na podstawie zapytania
router.get('/searchUsers', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Query is required' });
  }
  const queryParts = query.trim().split(/\s+/);

  try {
    const users = await User.find({
      $and: queryParts.map(part => ({
        $or: [
          { firstName: { $regex: part, $options: 'i' } },
          { lastName: { $regex: part, $options: 'i' } }
        ]
      }))
    }).select('firstName lastName email');

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
