const express = require('express');
const User = require('../models/User');
const Notification = require('../models/Notification');
const router = express.Router();
const { io } = require("../server");

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
    console.error("Error fetching user:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

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

router.post('/friendRequests', async (req, res) => {
  const { senderEmail, receiverEmail } = req.body;

  if (!senderEmail || !receiverEmail) {
    return res.status(400).json({ message: 'Both senderEmail and receiverEmail are required' });
  }

  try {
    const user = await User.findOne({ email: senderEmail });
    const friend = await User.findOne({ email: receiverEmail });

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    if (user.friends.some(f => f.email === receiverEmail)) {
      return res.status(400).json({ message: 'You are already friends' });
    }

    if (user.friendRequestsSent.includes(friend._id)) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    if (user.friendRequestsReceived.includes(friend._id)) {
      return res.status(400).json({ message: 'You have already received a request from this user' });
    }

    user.friendRequestsSent.push(friend._id);
    friend.friendRequestsReceived.push(user._id);

    await user.save();
    await friend.save();

    const notification = new Notification({
      type: 'friendRequest',
      recipient: friend._id,
      sender: user._id,
      relatedObject: null,
      relatedObjectType: 'user',
      message: `${user.firstName} ${user.lastName} sent you a friend request!`,
      isRead: false,
    });

    await notification.save();

    io.to(friend._id.toString()).emit('notification', {
      message: notification.message,
      type: 'friendRequest',
      sender: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      createdAt: notification.createdAt,
    });

    res.status(200).json({ message: 'Friend request sent successfully' });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/friend-request/accept', async (req, res) => {
  const { userId, friendEmail } = req.body;

  if (!userId || !friendEmail) {
    return res.status(400).json({ message: 'Both userId and friendEmail are required' });
  }

  try {
    const user = await User.findById(userId);
    const friend = await User.findOne({ email: friendEmail });

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    if (!user.friendRequestsReceived.includes(friend._id)) {
      return res.status(400).json({ message: 'No friend request found' });
    }

    user.friendRequestsReceived = user.friendRequestsReceived.filter(
      (requestId) => !requestId.equals(friend._id)
    );
    friend.friendRequestsSent = friend.friendRequestsSent.filter(
      (requestId) => !requestId.equals(user._id)
    );

    user.friends.push(friend);
    friend.friends.push(user);

    await user.save();
    await friend.save();

    const notification = new Notification({
      type: 'friendRequestAccepted',
      recipient: friend._id,
      sender: user._id,
      relatedObject: null,
      relatedObjectType: 'user',
      message: `${user.firstName} ${user.lastName} accepted your friend request!`,
      isRead: false,
    });

    await notification.save();

    io.to(friend._id.toString()).emit('notification', {
      message: notification.message,
      type: 'friendRequestAccepted',
      sender: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      createdAt: notification.createdAt,
    });

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (err) {
    console.error("Error accepting friend request:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/friend-request/reject', async (req, res) => {
  const { userId, friendEmail } = req.body;

  const decodedUserId = decodeURIComponent(userId); 
  const decodedFriendEmail = decodeURIComponent(friendEmail); 

  if (!decodedUserId || !decodedFriendEmail) {
    return res.status(400).json({ message: 'Both userId and friendEmail are required' });
  }

  try {
    const user = await User.findById(decodedUserId);
    const allUsers = await User.find();
    const friend = await User.findOne({ email: decodedFriendEmail });

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    if (!user.friendRequestsReceived.includes(friend._id)) {
      return res.status(400).json({ message: 'No friend request found' });
    }

    user.friendRequestsReceived = user.friendRequestsReceived.filter(
      (requestId) => !requestId.equals(friend._id)
    );
    friend.friendRequestsSent = friend.friendRequestsSent.filter(
      (requestId) => !requestId.equals(user._id)
    );

    await user.save();
    await friend.save();

    res.status(200).json({ message: 'Friend request rejected' });

  } catch (err) {
    console.error("Error rejecting friend request:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:userId/friend-requests', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate('friendRequestsReceived');
    const friendRequests = user.friendRequestsReceived.map((friendId) => {
      const friend = friendId;
      return {
        _id: friend._id,
        sender: {
          firstName: friend.firstName,
          lastName: friend.lastName,
          email: friend.email
        }
      };
    });
    res.json({ receivedRequests: friendRequests });
  } catch (err) {
    console.error("Error fetching friend requests:", err);
    res.status(500).json({ message: 'Error fetching friend requests' });
  }
});



router.get('/friendRequests/status/:userId', async (req, res) => {
  const { userId } = req.params;
  const { friendEmail } = req.query;

  if (!userId || !friendEmail) {
    return res.status(400).json({ message: 'Both userId and friendEmail are required' });
  }

  try {
    const user = await User.findOne({ email: userId });
    const friend = await User.findOne({ email: friendEmail });

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    let status = 'none';

    if (user.friends.some(f => f.email === friendEmail)) {
      status = 'accepted'; 
    } else if (user.friendRequestsSent.includes(friend._id)) {
      status = 'pending';
    } else if (user.friendRequestsReceived.includes(friend._id)) {
      status = 'received';
    }

    res.status(200).json({ status });
  } catch (err) {
    console.error("Error checking friend status:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/removeFriend', async (req, res) => {
  const { userEmail, friendEmail } = req.body;

  if (!userEmail || !friendEmail) {
    return res.status(400).json({ message: 'Both userEmail and friendEmail are required' });
  }

  try {
    const user = await User.findOne({ email: userEmail });
    const friend = await User.findOne({ email: friendEmail });

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    user.friends = user.friends.filter((friendId) => !friendId.equals(friend._id));
    friend.friends = friend.friends.filter((friendId) => !friendId.equals(user._id));

    await user.save();
    await friend.save();

    res.status(200).json({ message: 'Friend removed successfully' });
  } catch (err) {
    console.error("Error removing friend:", err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
